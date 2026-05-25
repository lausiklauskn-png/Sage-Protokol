# Übergabeprotokoll — Pflege Endknoten-Migrations-Brief erweitern (Module 15 + 16)

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Pflege (Doku-only, kein Modul-Code-Eingriff)
**Branch:** `claude/brief-pflege-endknoten-migration-xRN7n`
**Voraussetzung:** PR #159 (Bau-Sitzung 15.B, Sichttest 8/8 grün
2026-05-25, squash `7547ced`) + PR #160 (Sichttest-Status-Nachzug,
squash `d2b44c3`) + Bau-Sitzung 16 + Pflege Wappen/Korona (PR #152 +
PR #154 gemerged 2026-05-24).

---

## Was getan

**Reine Doku-Pflege**, zwei Dateien erweitert:

### 1. `docs/components/09_einbau_pwa.md` — Karte 09 Erweiterung

- **§ Andock-Schritt-Pfad-Überschrift** „neun Schritte" → „elf
  Schritte". Mermaid-Flowchart-Knoten von A1–A9 auf A1–A11 erweitert
  (neue Knoten: A10 Membran-Allowlist + FREMD-Lampe, A11 Siegel-
  Badge). Erläuterungs-Absatz darunter um die zwei neuen Schritte
  ergänzt + Verweis auf CLAUDE.md § Pipeline-Reihenfolge.
- **§ Schritt 2 `<script>`-Reihenfolge** `01→02→03→04→05→07→00` →
  `01→02→03→04→05→07→00→15→16`. Reihenfolge-Begründungs-Absatz
  erweitert: Modul 15 nach 00 (Sub (a) `read()` liest Spore/
  Anastomose/Storage fail-soft — Andock-Konvention, kein harter
  Block); Modul 16 zuletzt (surface-checkt 01/02/03/04/05/07/15;
  fehlt eines, kein Badge — Anti-Greenwashing-Klausel binär).
  Inline-Stil-Hinweis von „sieben JS-Dateien" auf „neun JS-Dateien"
  nachgezogen.
- **§ Sichtkontrolle nach dem Andocken § Punkt 1** sieben → elf
  Selbstcheck-Zeilen, plus Modul-15- und Modul-16-Konsolen-Zeilen
  explizit benannt. **§ Punkt 2** `sbkim` → `sbkim_<DB_SUFFIX>`
  korrigiert (PWA-Suffix seit Pflege 2026-05-16) + Hinweis: Modul
  15 + 16 nutzen kein IndexedDB (RAM-only).
- **Zwei neue Sichtkontroll-Punkte** angehängt: **Punkt 7 FREMD-
  Lampe sichtbar** (grau/rot/Klick-Modal-Verhalten); **Punkt 8
  Siegel-Badge sichtbar (wenn `isCertified()===true`)** mit
  Diagnose-Hinweis auf `SBKIM-Siegel kein Render:`-Konsolen-Zeile
  bei fehlendem Pflicht-Modul.
- **§ Andock-Schritt-Pfad NEUE Schritte 10 + 11** nach Schritt 9
  angehängt:
  - **Schritt 10 — Membran-Allowlist + FREMD-Lampe + SW-Probe-
    Detektor:** Modul-Datei-Kopie (15_membran.js + sbkim-sw.js),
    CSS-Anker (`--lamp-alert`, `.lamp.fremd-alert`,
    `.lamp.fremd-pulse`, `@keyframes lamp-breath`,
    `@keyframes lamp-alert-pulse` — 1:1 aus Sage-Protokol's
    `index.html` Z. 121–127), Navleisten-Markup `#lamp-fremd`,
    `sbkim-init.js`-Aufruf mit `allowedOrigins`-Tabelle pro
    Endknoten, `enableTestButton:true` NICHT bei Endknoten
    (Sage-Page-only-Konvention aus Karte 15 § Pflege Sage-Page-
    Sichttest-Knopf 2026-05-24). Sichtkontroll-Block + drei häufige
    Fehler-Diagnosen.
  - **Schritt 11 — SBKIM-Siegel-Badge:** Modul-Datei-Kopie
    (16_siegel.js), vier `--siegel-*`-CSS-Variablen (1:1 aus
    Sage-Protokol's `index.html` Z. 42–45), `#sbkim-siegel-badge`-
    CSS-Block + First-Boot-Animation (1:1 aus Z. 129–134), Option β
    `.lamps`-Container-Anker analog Sage-Page, `repoUrl`-Override-
    Tabelle pro Endknoten (Mein-Rezeptbuch / Mein-Mixarium /
    Sage-Auto-Erkennung), Anti-Greenwashing-Hinweis (kein Badge
    ohne grüne Selbst-Prüfung). Sichtkontroll-Block + drei häufige
    Fehler-Diagnosen.
- **§ Bauzustand** um Zeile „Pflege Endknoten-Migrations-Brief
  erweitern (Module 15 + 16) / 2026-05-25" als jüngsten Eintrag
  ergänzt (oberhalb der Sage-Page-Refactor-Zeile, sodass die
  chronologische Reihenfolge ungestört bleibt — innerhalb der
  Tabelle als neuester Eintrag am 25.05.).

### 2. `docs/sessions/BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md` — Brief-Erweiterung

- **Aufgaben-Liste** von „sechs Punkte a–f" auf „acht Punkte a–h"
  umbenannt.
- **Punkt a)** um `15_membran.js` + `16_siegel.js` als zu kopierende
  Quell-Dateien erweitert; SW-Datei-Hinweis um SW-Probe-Detektor
  (Bau 15.SW) ergänzt.
- **Punkt b)** script-Reihenfolge um `→ 15_membran → 16_siegel`
  erweitert; Begründungs-Absatz ergänzt um Modul-15- + Modul-16-
  Position.
- **Punkt e) Sichttest** neun → elf Selbstcheck-Zeilen; Modul-15-
  + Modul-16-Zeilen explizit eingefügt.
- **NEUE Punkte g) Modul 15 (Membran) einbauen** — Schritt-10-
  Vollanleitung mit Modul-Datei-Kopie, `:root`-CSS-Variablen,
  Lampen-Style-Block, FREMD-Lampe-HTML, `sbkim-init.js`-Aufruf,
  `allowedOrigins`-Tabelle pro Endknoten, Erwartungs-Block
  (Konsolen-Zeile + Lampe + Modal + SW-Probe-Detektor), Endknoten-
  Sichttest-Workaround mit drei Test-Pfaden (Cross-Origin-Fetch in
  Eruda / KI-Browser-Agent-Wartezeit / `_recordForTest`-Test-
  Brücke).
- **NEUE Punkte h) Modul 16 (Siegel) einbauen** — Schritt-11-
  Vollanleitung mit Modul-Datei-Kopie, vier Siegel-CSS-Variablen,
  Badge-Style-Block, Container-Anker (Option β `.lamps` ODER neuer
  Container), `sbkim-init.js`-Aufruf mit `repoUrl`-Override-Tabelle
  (Mein-Rezeptbuch / Mein-Mixarium), Anti-Greenwashing-Hinweis,
  Erwartungs-Block (Konsolen-Zeile + Badge + Modal + Esc/Backdrop +
  `isCertified()`-Aufruf).
- **Pflicht am Ende der Sitzung § Punkt 1** neun → elf Selbstcheck-
  Zeilen + neue Erwartung „FREMD-Lampe sichtbar + Siegel-Badge
  sichtbar (wenn certified)".
- **Zeitschätzung** ~2 h → ~2.5–3 h pro Endknoten (zusätzliche CSS-
  Anker für 15 + 16, Sichttest-Knoten).
- **Meta-Sitzung-Kontext** Pipeline-Verweis aktualisiert (Pipeline-
  Schritt 5 statt „letzte Phase Brief-99"); neuer Pflege-Eintrag
  2026-05-25 zur Brief-Erweiterung dokumentiert.

---

## Was offen geblieben ist

- **Klaus' Bau-Sitzungen in den zwei externen Endknoten-Repos**
  (`Mein-Rezeptbuch` + `Mein-Mixarium`) — Pipeline-Schritt 5 voll
  ausführen. Briefe sind jetzt komplett (Module 00–08 + 15 + 16).
- **App-Freigabe** (Pipeline-Schritt 6) folgt nach beiden externen
  Endknoten-Sitzungen.
- **Optionale Folge-Pflegen** (nicht blockierend, eigene Mini-
  Sitzungen):
  - Modul 16 Voll-Sichttest (Panel 16 Knöpfe 1–6) — Klaus hat
    2026-05-25 nur den Sage-Page-Bonus-Check gemacht („Badge
    sichtbar in Navleiste"); der volle Panel-16-Sichttest fehlt.
  - Klaus' lokales `sbkim_siblings` aufräumen (Selbst-Eintrag mit
    eigener nodeId, sichtbar im Anti-PII-Filter aus PR #159).
  - PULS.md-Auslagerung (3000-Zeilen-Grenze pre-existing
    überschritten).

## Was diese Sitzung NICHT geändert hat

- **KEINE Modul-Code-Änderung** (`src/modules/*.js` unangetastet —
  Karte 15 / 16 / Modul 15 / 16 sind Tafeln).
- **KEIN `index.html`-Eingriff** in der Sage-Page (die Vorlage
  bleibt).
- **KEINE Spec-Änderung** an Karte 15 / Karte 16 / INTERFACES § 1
  Modul 15 / Modul 16 — die sind verbindlich.
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **KEINE Pipeline-Reihenfolge-Umsortierung** in CLAUDE.md (Schritt
  5 → Schritt 6 bleibt).
- **KEINE `status.json`-Pie-Regeneration** — Pflege ist additiv im
  Andock-Pfad, kein Score-Wechsel.
- **KEINE INTERFACES § 6 Endknoten-Tabelle-Erweiterung** mit
  `siegelBadgeMounted`-Spalte: sekundärer Auftrag aus dem Brief
  abgewogen und VERWORFEN — die Tabelle hat ein
  `id/domain/domainDescription/domainKeywords/domainVector`-Schema
  (verbindliche Spec); eine `siegelBadgeMounted`-Spalte wäre fremd
  in dieser Schema-Form. Endknoten-spezifischer Badge-Mount-Zustand
  gehört in den Sichttest-Befund pro Endknoten-Bau-Sitzung
  (Übergabeprotokolle im Endknoten-Repo), nicht in die Spec-Tabelle.
- **KEIN Sichttest nötig** (reine Doku-Pflege; Karte 09 + Brief
  sind Spec, kein ausführbarer Code).

---

## Nächster sinnvoller Schritt

1. **PR mergen** (oder Draft-PR reviewen) — Karte 09 + Brief sind
   jetzt vollständig und bereit für die externen Endknoten-Bau-
   Sitzungen.
2. **Pro Endknoten-Repo eine externe Bau-Sitzung** mit dem
   erweiterten Brief als ersten Prompt: erst Mein-Rezeptbuch,
   dann Mein-Mixarium (oder parallel — Brief-Inhalt ist identisch).
   Pipeline-Schritt 5 voll ausführen.
3. **App-Freigabe** (Pipeline-Schritt 6) — die drei Apps
   (Mein-Rezeptbuch + Mein-Mixarium + Sage) mit Siegel-Badge
   sichtbar verteilen.

Bis dahin **kein weiterer Sage-Protokol-Eingriff** — Klaus arbeitet
in den Endknoten-Repos. Eine Folge-Sitzung in Sage-Protokol nur,
wenn ein Endknoten-Bauer einen Befund am Modul-Code findet (dann
eigene Pflege-Sitzung im Sage-Protokol-Repo).
