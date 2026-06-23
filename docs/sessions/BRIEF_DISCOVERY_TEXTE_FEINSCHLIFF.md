# Brief — Folge-Sitzung: Discovery-Seite · Text-Feinschliff + Rest-Politur

> Angelegt 2026-06-23 am Ende der Hero-Animations-Sitzung. Voraussetzung:
> Discovery-Seite ist auf `main` (HEAD-Commits #402–#408), Hero-Animation von
> Klaus am Tablet abgenommen („sehr gut gearbeitet"). Offen geblieben: die
> **Texte** wollte Klaus noch durchgehen.

```
Du bist eine Bau-Sitzung in Sage-Protokol — „Discovery-Seite: Text-Feinschliff".
Freibrief gilt (CLAUDE.md § Freibrief; eigene PRs selbstständig auf main mergen,
wenn getestet + abgegrenzt). Klaus arbeitet live am Galaxy Tab S6 mit; Konvention
dieser Strang-Sitzungen: pro Änderung ein eigener kleiner Branch → PR → squash auf
main; danach gibt Klaus den main-Termux-Befehl + Hard-Reload zum Anschauen.

Pflichtleseliste:
1. CLAUDE.md
2. docs/PULS.md (oberster Eintrag + der zweitoberste „Bau der WebGL-Seite")
3. docs/components/_discovery_expedition.md (Vision/Texte)
4. docs/discovery/index.html (NUR die Text-/i18n-Stellen: window.DISCOVERY_FUNGI,
   die Hero-/Anker-/Galerie-/Schluss-Sektionen, die .whisper-Zeilen)

Auftrag (mit Klaus abstimmen, dann umsetzen — pro Änderung eigener Commit/PR):
1. Texte durchgehen und nach Klaus' Wünschen anpassen:
   - Hero-Titel + Untertitel
   - Wissenschafts-Anker-Sektion (Sternenstaub → Geflecht)
   - Pilz-Galerie: pro Pilz Titel/kicker/body/„Unser Spiegelbild…"
   - Schluss-Sektion + die zwei .whisper-„versteckten Botschaften"
   Ton: würdevoll, staunend, ehrlich; andeutend statt plakativ (vgl. Vision-Karte
   § Gestaltung). Wo Wissenschaft endet und Glaube beginnt: nichts behaupten,
   nur andeuten.
2. Headless-Smoke grün halten: PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers \
   node docs/discovery/_smoke.mjs  (erwartet 11/11; der Hero-Titel-Check prüft
   /Leben/ — bei Titeländerung ggf. den Check in _smoke.mjs mit anpassen).
3. Optional/Folge (nur nach Klaus' Zuruf): Sage-Page (index.html) verlinkt die
   Discovery-Seite; ob die 4 Storyboard-Standbilder (galaxien/elemente-erde/
   kosmos-mycel) zusätzlich in Hero/Anker eingewoben werden.

Leitplanken:
- Nur Doku + Assets + die Vision-Seite. KEIN Modul-Code in src/, kein
  Protokoll-Bump. Keine PII. Bilder bleiben „KI-generiert".
- Discovery-MECHANIK (Verzeichnis/Gossip) bleibt eine spätere Spec/Bau-Sitzung
  Modul 14 — NICHT hier.

Stand der Hero-Animation (nicht anfassen, außer Klaus wünscht es):
- Eröffnung: Nebel-Hintergrund (galaxie-hintergrund.webp) → Galaxien funkeln →
  3 Kometen mit Feenstaub-Schweif schlagen auf die dunkle Früh-Erde ein
  (erde-dunkel.webp, aus erde-blau.webp abgeleitet) → beim Hochscrollen wird die
  Erde fließend blau (erde-blau.webp) → goldenes Mycel wächst unten.
- Klick/Tipp im Hero = Funken-/Halo-Ausbruch am Klickpunkt.
- renderOrder: Nebel −10 < Erde 5 < Schnebel/Dust 8 < Kometen/Funken 20.
- Robust: prefers-reduced-motion (statisch, Erde gleich blau), WebGL-Guard,
  Tablet-DPR, graceful Bild-Fallback. Smoke 11/11 grün.
```
