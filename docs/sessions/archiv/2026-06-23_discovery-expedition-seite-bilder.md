# Übergabeprotokoll — 2026-06-23 · Discovery-Expedition: Bau der Seite + 15 KI-Bilder

**Rolle:** Bau-Sitzung (Freibrief). **Branch:** `claude/discovery-expedition-imagery-3t3dya` · **PR:** #402 (Draft).

---

## Auftrag

Folge-Sitzung zur Discovery-Expedition (Brief
`docs/sessions/BRIEF_DISCOVERY_EXPEDITION_BILDER.md`): Klaus' KI-generierte
Pilz-Bilder entgegennehmen, ablegen, in die Doku-Karte einbetten — **und** die
eigenständige Discovery-Expeditions-Seite in Einladungs-Qualität bauen
(Kosmos → Element-Wanderung → Mycel → Pilz-Galerie, würdevoll, andeutend, als
Dokumentation der Schöpfung).

## Was gebaut wurde

1. **`docs/discovery/index.html`** — eigenständige WebGL-Schöpfungs-Seite.
   - Vendorierte Libs (three.js, GSAP, Fonts) werden **aus `docs/einladung/vendor`
     geteilt** (relative Pfade `../einladung/vendor/…`) — kein zweites ~800-KB-Paket.
   - **Eröffnungs-Animation (prozedurales WebGL, ein fixes Canvas):** Galaxien
     entzünden sich gestaffelt (`aBirth` je Cluster, Flash bei Geburt) und
     verbinden sich über Filament-Linien → Erde + Atmosphären-Fresnel blenden
     ein → Sternenstaub-Strom (Bezier-Bahn) fließt zur Erde → goldenes Mycel
     wächst von unten am Erd-Horizont. Kamera wandert vom Weitwinkel zur Erde
     und hinab zum Mycel. Master-`progress` 0→1 per GSAP-Timeline (~13 s);
     Storyboard-Untertitel in 4 Phasen; „Überspringen"-Knopf; erstes
     Scroll/Touch überspringt sanft.
   - Danach DOM-Sektionen: Wissenschafts-Anker (Nukleosynthese/Sternenstaub,
     Pilze halfen dem Leben an Land) → **Pilz-Galerie** (11 Fähigkeiten aus
     `window.DISCOVERY_FUNGI`, je Bild + Staun-Text + `mirror` SBKIM-Bezug +
     ehrliche `caveat`) → Schluss-Bild → zwei würdevolle „versteckte
     Botschaften" (`.whisper`, blenden beim Scrollen ein).
   - **Robustheit:** `prefers-reduced-motion` → statische Komposition
     (progress=1, kein rAF-Loop); WebGL-`try/catch` + Context-Loss-Guard;
     DPR-Deckel 1.5 auf coarse-pointer (Tablet); Scrim verdunkelt den Kosmos
     beim Scrollen für Lesbarkeit; **graceful Bild-Fallback** — fehlt ein
     `assets/discovery/<name>.webp`, bleibt eine museale Platzhalter-Kachel
     stehen (kein 404-Bruchbild), echtes Bild erscheint per `onload`.

2. **`assets/discovery/` — 15 KI-Bilder** (von Klaus generiert, von mir mit
   Pillow auf ≤1600px lange Kante / webp q82 verkleinert, je ~70–460 KB,
   gesamt 3,6 MB): `mykorrhiza, physarum, radiotroph, weissfaeule, plastik,
   flechte, armillaria, biolumineszenz, ophiocordyceps, mitbauer, hyphendruck`
   (11 Pilz-Motive) + `galaxien, elemente-erde, kosmos-mycel, schlussbild`
   (4 Storyboard-Szenen). Plus `README.md` (Namens-/Format-Konvention).
   - **Ophiocordyceps** wurde auf Klaus' Korrektur **neu generiert**: erste
     Version zeigte einen „Monsterkäfer" mit Schirm-Pilz; die genommene Version
     zeigt eine naturgetreue Waldameise mit schlankem, gebogenem
     Fruchtkörper-**Stiel** (kein Schirm), die Ameise sanft leuchtend, nicht
     entstellt.

3. **`docs/components/_discovery_expedition.md`** — alle 15 Bilder eingebettet
   (11 inline an den Fähigkeiten + Storyboard-Block mit 4 Szenen), jeweils als
   „KI-generiert" gekennzeichnet; Status-Header auf „✅ vorhanden" + Verweis
   auf die gebaute Seite.

4. **`docs/discovery/_smoke.mjs`** — Headless-Smoke (Playwright, swiftshader),
   Server-Wurzel = Repo-Wurzel (damit `../einladung/vendor` und `../../assets`
   auflösen). **11/11 grün.** Fehlende-Bild-404 werden über den Response-Status
   gefiltert (dokumentiert).

## Bewiesen / nicht bewiesen

- ✅ **Headless-Smoke 11/11 grün** (Canvas dimensioniert, 11 Galerie-Kacheln,
  4 Storyboard-Zeilen, 2 Whisper, Schluss-Figur, 4 Footer-Links, Hero-Reveal
  nach „Überspringen", keine unerwarteten Konsolen-Fehler/404).
- ⚠️ **Klaus' Browser-Sichttest steht aus** (Galaxy Tab S6, Tablet + DeX):
  läuft die Eröffnungs-Animation flüssig und würdevoll? Laden alle Bilder?
  Reduced-Motion-Pfad? Performance/GPU? — headless ersetzt das nicht.

## Leitplanken eingehalten

Nur Doku + Assets + Vision-Seite; **kein** Modul-Code in `src/`, **kein**
Protokoll-Bump; keine PII; Bilder als „KI-generiert". Discovery-**Mechanik**
(Verzeichnis/Gossip) bleibt bewusst eine spätere Spec/Bau-Sitzung Modul 14.

## Nächster sinnvoller Schritt

1. **Klaus-Sichttest** der Seite (`docs/discovery/index.html`) im Tablet-Browser
   nach Hard-Reload. Rückmeldung zu Animation/Tempo/Lesbarkeit/Performance.
2. Nach grünem Sichttest: **PR #402 ready + mergen** (Freibrief).
3. Optional/Folge-Pflege: Discovery-Seite von der **Sage-Page** verlinken/mounten;
   Entscheidung, ob die 4 Storyboard-Standbilder zusätzlich in die Hero-/Anker-
   Sektionen eingewoben werden (derzeit rein prozedurales WebGL + nur
   `schlussbild` als Foto auf der Seite).

## Commits dieser Sitzung (Auszug)

`c4e5310` Seite + Galerie + Bilder 1–6 · `578355b` Bild 7 · `9aece7f` Bild 8 ·
`7a4c76a` Bild 9 (ophiocordyceps korrigiert) · `080c628` Bild 10 · `eb66eae`
Bild 11 · `45db69b` Bild 12 · `06ed6c8` Bild 13 · `d5c247a` Bild 14 · `c5a61e5`
Bild 15 · + Karte-Einbettung + PULS/Übergabe.
