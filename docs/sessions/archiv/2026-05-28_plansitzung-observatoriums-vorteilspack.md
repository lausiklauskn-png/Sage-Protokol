# Übergabeprotokoll · 2026-05-28 · Plansitzung Observatoriums-Vorteilspack (Truhe-Brief)

**Branch:** `claude/brief-observatoriums-vorteilspack`
**Pipeline-Position:** Vision-Anker-Vorbereitung Schicht 4
(Pipeline-Phase-frei). Brief-Anlage-Sitzung, kein Bau.
**Sitzungs-Rolle:** kleine Sitzung — Brief + Konzept-Karte +
CLAUDE.md-Pflege. Bau läuft NACH MR + MM Re-Migration in eigener
Sitzung.
**Auslöser:** Klaus' Vision 2026-05-28 nach grünem Sichttest Bau 18
Sub (a) Vorab (PR #194).

---

## Klaus' Vision (wörtlich)

> Können wir im Sage-Protokol Observatorium eine Toolboxtruhe mit
> den Tools die wir für SB-KIMTool-Point bauen machen — mit
> ausführlicher Beschreibung für jedes Tool, der Möglichkeit es per
> Copy-Paste in jedes beliebige Repo zu kopieren. Die Toolbox soll
> eine alte Seemannskiste sein die genauso leicht geöffnet scheint
> wie die Tür zur Einladung mit den selben Design-Funktionen wie die
> Tür. Nicht so groß wie die, eher wie der Container Schwarzes Loch
> und Sonne. Die Tools sollen leicht zu kopieren sein damit man sie
> in sein eigenes Repo einbauen kann.

Zusatz nach Klärungs-Fragen:

- **Inhalt:** alle Tools, „Verpackung" mit Außen-Erkennbarkeit der
  Aufgabe; Klick öffnet voll-Paket mit Test-Modul + Erklärung +
  Einbau-Anleitung + Vibe-Coding-Prompt.
- **Tier-System:** absolut notwendig / Basic / Pro / Must-have (drei
  Stufen — „Mast have" = Tippfehler für Must-have, synonym mit
  „absolut notwendig").
- **Pipeline:** „Erst MR + MM, dann Truhe = Starter-Bundle-Vorzug
  (anderes Wort: Vorteilspack)".
- **Optik:** Truhe + Schlüssel-Schritt.

---

## Was getan

### 1. Brief `BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`

~420 Zeilen voll angelegt. Inhalt:

- **Anlass-Block** mit Klaus' Wort und Verbindung zur Vier-
  Schichten-Lesart (CLAUDE.md § Pflege 2026-05-27 Schicht 4).
- **Pflicht-Verifikations-Schritt** (sieben Punkte — main pull,
  CLAUDE.md, Konzept-Karte, Schwester-Konzept _starter_bundle.md,
  Einladungs-Optik Scene 5/5b, Schwarz-Loch-Container-Größe, alle
  Modul-Karten).
- **Pflicht-Disziplin** (sechs Tabus — `src/modules/`-Eingriff,
  Versions-Bumps, ZERTIFIKAT_ASPEKTE-Eintrag, Endknoten-Eingriff,
  Modul-19-Bau, Tafel-Umsortierung).
- **Aufgabe**: Sage-Page-Karte mit Truhe + Schlüssel-Mechanik in
  vier Phasen (Schlüssel rotiert → Deckel kippt → Tool-Grid sichtbar);
  Tool-Tile-Außen-Sicht (Tier-Badge + Icon + Name + Aufgabe +
  Status-Marker); Tool-Modal mit neun Sektionen pro Tool (Was, Wie
  funktioniert, Wie einbauen, Vibe-Coding-Prompt, Code-Kopier-
  Knopf, Vibe-Coding-Prompt-Kopier-Knopf, Test-Modul-Anker,
  Querverweise).
- **Tier-Vorschlag** für die Bau-Sitzung:
  - Must-have (3): 01 Storage, 02 Spore, 15 Membran.
  - Basic (7): 03 Embedding, 04 Match, 05 Anastomose, 07 Apoptose,
    16 Siegel, 17 Floating-Widget, 18 Tool-PWA Sub (a) Vorab.
  - Pro (8+): 00 Doku-Fenster, 06 Heterokaryose, 08 UI-Demo, 09
    Einbau-Anleitung, 10/11/12 Schutz-Backlog, 14 Diffusion-Backlog,
    19 Andock-Wizard (Konzept).
- **Vibe-Coding-Prompt-Paket-Template** als Klaus copy-paste-Vorlage.
- **Code-Inhalt-Strategie**: Empfehlung Hybrid (statische Metadaten
  + lazy-fetch der Modul-Datei beim Kopier-Klick).
- **Beziehung zum Starter-Bundle** (Phase B Schritt 8) geklärt:
  Truhe = klick-und-kopier auf Sage-Page; Starter-Bundle = git-
  clone in externem Repo. Beide parallel, gleicher Inhalt.

### 2. Konzept-Karte `_observatoriums_vorteilspack.md`

Schablone mit Vokabular (Vorteilspack, Truhe-Stage, Tool-Tile,
Tool-Modal, Tier-System, Vibe-Coding-Prompt-Paket, Status-Marker),
Klaus-Festlegungen 2026-05-28 (fünf Tafel-Punkte), sechs Sub-
Bereiche (a Truhe-Stage / b Tool-Tile-Grid / c Tool-Modal /
d Tool-Datenbank / e Clipboard-API / f Vibe-Coding-Prompt-
Generator), Strikte Tabus, Bauzustand-Tabelle.

### 3. CLAUDE.md § Vision-Anker-Vorbereitung

Neue Zeile für Observatoriums-Vorteilspack-Truhe ergänzt mit:

- Klaus' Vision-Anker (Wort „Vorteilspack").
- Optik-Vorlage (Schlüssel-Schritt analog Einladungs-Tür, Größe
  wie `.blackhole-stage`/`.sun-scene`).
- Inhalt (alle SBKIM-Tools 00–19 mit Tier-Badge).
- Pipeline-Position (NACH MR + MM, parallel zu Phase B Schritt 7).
- Querverweise zu Brief + Konzept-Karte.

**KEINE Pipeline-Umsortierung** der Phase-A/B-Reihenfolge.

### 4. PULS-Eintrag oben

Voller Sitzungs-Eintrag mit allen vier Pflicht-Disziplin-Punkten +
vier offenen Punkten für die Bau-Sitzung.

---

## Pflicht-Disziplin eingehalten

- ✓ KEIN Code in `src/modules/`.
- ✓ KEIN Sage-Page-Eingriff in `index.html` (kommt erst in der
  Bau-Sitzung).
- ✓ KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.
- ✓ KEIN `ZERTIFIKAT_ASPEKTE`-Eintrag.
- ✓ KEINE Tafel-Umsortierung (Pipeline-Tabelle Phase A/B unverändert;
  Truhe in Vision-Anker-Vorbereitung-Block, Pipeline-Phase-frei).
- ✓ KEIN Endknoten-Eingriff.

---

## Was offen blieb

1. **Bau-Sitzung Observatoriums-Vorteilspack-Truhe** in eigener
   Branch `claude/bau-observatoriums-vorteilspack`. Brief liegt.
   Voraussetzung: MR + MM Re-Migration durch.
2. **Tier-Liste final entscheiden** in der Bau-Sitzung — Vorschlag
   im Brief steht, Klaus kann verschieben.
3. **Asset-Frage** Schlüssel-WebP-Reuse aus
   `docs/einladung/vendor/img/` ODER eigene CSS-/SVG-Variante —
   wird in der Bau-Sitzung gelöst.
4. **Tool-Datenbank-Quelle** Build-Time-JSON ODER Runtime-Fetch
   ODER Hybrid — Empfehlung Hybrid im Brief.
5. **PR #194 Sichttest-Nachzug Bau 18 Sub (a) Vorab** noch offen
   in `main`. Diese Brief-Sitzung wurde von `main` gestartet
   (nicht vom Sichttest-Branch), Inhalte sind kompatibel.

---

## Nächster sinnvoller Schritt

1. **PR #194 mergen** (Sichttest-Nachzug, kleiner Doku-Pflege).
2. **Diese Brief-PR mergen** (Brief + Konzept-Karte + CLAUDE.md-
   Pflege).
3. **Endknoten-Re-Migration MR** als eigene Sitzung in
   `lausiklauskn-png/Mein-Rezeptbuch`. Brief-Codeblock liegt in
   der Bau-Sitzung-18-Antwort vom 2026-05-28.
4. **Endknoten-Re-Migration MM** als eigene Sitzung in
   `lausiklauskn-png/Mein-Mixarium`. Brief-Codeblock liegt in
   der gleichen Antwort.
5. **Bau-Sitzung Observatoriums-Vorteilspack-Truhe** in eigener
   Branch — Brief in dieser Sitzung angelegt.

---

## Querverweise

- Brief: `docs/sessions/BRIEF_BAU_OBSERVATORIUMS_VORTEILSPACK.md`.
- Konzept-Karte: `docs/components/_observatoriums_vorteilspack.md`.
- CLAUDE.md § Vision-Anker-Vorbereitung (neue Zeile).
- Schwester-Konzept: `docs/components/_starter_bundle.md`.
- Optik-Vorlage: `docs/einladung/index.html` Scene 5 + 5b.
- Container-Größe: `index.html` § Schwarz-Loch-Karte (`.blackhole-
  stage` 220–320 px) + `.sun-scene` (280 px).
- Vier-Schichten-Lesart: `CLAUDE.md` § Pflege 2026-05-27 Schicht 4.
