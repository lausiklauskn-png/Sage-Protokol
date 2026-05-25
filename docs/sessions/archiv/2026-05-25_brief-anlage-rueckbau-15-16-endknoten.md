# Übergabeprotokoll — Brief-Anlage Rückbau Modul 15 + 16 + Spore-Diagnose pro Endknoten

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Mini-Pflege (Brief-Anlage; kein Modul-Code-,
Spec- oder Sage-Page-Eingriff)
**Branch:** `claude/brief-rueckbau-15-16-endknoten`
**Parallel zu:** PR #163 (Spec-Sitzung-17-Floating-Widget-Brief,
Draft). Diese Pflege ist eine **Notfall-Pflege**, nicht Teil des
Spec-Pfads — sie räumt die zwei Endknoten auf, bevor das Widget
(Modul 17) gebaut + neu migriert wird.

---

## Klaus' zwei Befunde 2026-05-25

1. **UI-Befund** (schon adressiert in PR #163 mit Brief für Spec-
   Sitzung 17): Lampen + Siegel in der Navleiste nehmen zu viel
   Platz, nicht einheitlich zwischen den zwei Endknoten, kein
   User-X-Schließen.

2. **Spore-Verlust-Befund (NEU):** Mein-Rezeptbuch hat seine Spore
   (oder die IndexedDB-Identität) verloren; Mein-Mixarium kann
   keinen Handshake mehr zu Mein-Rezeptbuch herstellen.

3. **Visueller Befund aus Klaus' Screenshots 2026-05-25 17:30:**
   - **Mein-Rezeptbuch (live):** eigene Top-Header-Bar oben mit
     Lampen-Pille `LEBT · VERKEHR · FREMD · SBKIM-Siegel` — alle
     drei Lampen plus Siegel, Sage-Page-Optik 1:1 kopiert.
   - **Mein-Mixarium (live):** floating rechts außerhalb des App-
     Containers, nur `FREMD · Siegel-Badge` — KEINE LEBT/VERKEHR-
     Lampen, keine Top-Bar.
   - Bestätigt: beide Sitzungen haben den Brief verschieden
     interpretiert; Mein-Mixarium-Sitzung pausierte möglicherweise
     bei der Variante-1/2-Klärungs-Frage und hat nur einen Teil
     migriert.

4. **Klaus' Frage 2026-05-25:** „Die PWAs sollten alle auf main
   gemergt sein und auf main laufen?" — JA, GitHub Pages baut
   standardmäßig den `main`-Branch des jeweiligen Repos aus. Was
   live in der PWA ist, ist `main`-Stand. Daher muss die Rückbau-
   Sitzung als ALLERERSTE Phase den PR-Status pro Repo prüfen.

---

## Was getan

**Reine Doku-Pflege**, eine Brief-Datei:

### `docs/sessions/BRIEF_RUECKBAU_15_16_ENDKNOTEN.md`

~360 Zeilen Brief-Codeblock mit **sechs Phasen** plus Klaus-Phase F
nach der Sitzung. Brief gilt PRO ENDKNOTEN (Mein-Rezeptbuch UND
Mein-Mixarium), Inhalt identisch — die Sitzung erkennt selbst, in
welchem Repo sie läuft.

**Phase A0 (NEU, Klaus' Frage):** PR + main-Stand prüfen.
- Branch-Stand des lokalen Clones.
- PR-Historie der letzten 7 Tage im Endknoten-Repo (gemerged vs.
  offen).
- `main`-`index.html` lesen + `<script>`-Tags + Lampen/Siegel-Anker
  konkret zählen.
- Pages-Build-Status (wann zuletzt gebaut, hängt der Build?).
- Visual-Sichttest aus Klaus' Screenshots dokumentieren (Rezeptbuch
  hat volle Sage-Page-Optik, Mixarium hat nur FREMD+Siegel floating).
- Befund EXPLIZIT ins Übergabeprotokoll: PR-Daten, Pages-Build-Daten,
  Modul-Stand auf main, Visual-Stand-Diskrepanz.

**Phase A:** Spore-Lage + Service-Worker + Modul-Liste + Navleisten-
Markup + sbkim-init.js diagnostizieren (READ-ONLY).

**Phase B:** Rückbau in `index.html` — Modul-15-+-16-`<script>`-
Tags, CSS-Anker (`--lamp-alert`, `--siegel-*`, `.lamp.fremd-alert`,
`.lamp.fremd-pulse`, `#sbkim-siegel-badge`, zugehörige `@keyframes`),
Navleisten-Markup (`#lamp-fremd`, Siegel-Badge-Span), `.lamps`-
Container je nach Pre-Migration-Befund.

**Phase C:** Rückbau in `sbkim-init.js` — `SbkimMembrane.init` +
`SbkimSiegel.init` Aufrufe entfernen.

**Phase D:** Modul-Dateien + Service-Worker — `sbkim/15_membran.js`
+ `sbkim/16_siegel.js` löschen; `sbkim-sw.js` SW-Probe-Detektor
ausbauen; `CACHE_NAME`-Bump; File-Rename als zusätzlicher Cache-
Bust.

**Phase E:** Sichtkontrolle (Klaus, im Browser) — neun statt elf
Selbstcheck-Zeilen, keine FREMD-Lampe, kein Siegel-Badge, atmende
App-Header-Optik.

**Phase F (KLAUS-SCHRITT nach Sitzung):** Spore-Reparatur. Drei
Pfade je nach IndexedDB-Identität-Stand:
- **F2 Re-Sign:** Identität OK (Keypair in IndexedDB), nur Datei
  weg → `SbkimSpore.getOwnSpore()` in Eruda-Konsole, JSON copy,
  Commit. Schnellster Pfad, alte `nodeId` bleibt.
- **F3 Backup-Import:** Identität weg, Backup-Blob vorhanden →
  `SbkimSpore.importBackup(blob, password)`, selbe `nodeId`.
- **F4 Frische Identität:** Kein Backup → neue Identität via
  `getOrCreateIdentity()` + `generateOwnSpore()`. Neue `nodeId`,
  Mein-Mixariums alter Sibling-Eintrag wird ungültig.
- **F5 Konnektivitäts-Test:** Mein-Mixarium-Tab + Mein-Rezeptbuch-
  Tab beide offen, Handshake-Test in Eruda-Konsole.

**Heilige Tafeln im Brief (Rückbau-spezifisch):**
- Kein Sage-Protokol-Eingriff.
- Spore NICHT antasten (auch wenn defekt; Reparatur ist Browser-
  Crypto-Pflicht).
- IndexedDB NICHT manipulieren.
- Module 00–08 bleiben unverändert.
- `PROTOCOL_VERSION` / `DB_VERSION` / `BACKUP_FORMAT_VERSION`
  unverändert.
- `SbkimStorage.init({dbSuffix})` nicht ändern.

**Stolperfallen** im Brief:
- Cache-Bust ist Pflicht (sonst läuft die PWA weiter mit dem alten
  SW).
- Spore-Re-Sign braucht die LIVE-Domain-Werte (Vorsicht beim
  `domainVector`).
- Variante 3b App-SW-Patch mitbumpen beim File-Rename.
- Inkonsistenz zwischen Endknoten zulässig (pro Repo eigenständig).
- **PR-Stand prüfen ist wichtiger als Code-Diagnose** — wenn ein PR
  nicht gemerged ist, läuft Pages noch den alten Stand, der Rückbau-
  Pfad ist anders (z.B. einfach PR schließen statt Code rückbauen).

**Termux-Klärung:**
- Termux ist KEIN Code-Editor-Workflow (CLAUDE.md § Arbeitsumgebung).
- Aber für drei Operationen ist Termux der saubere Pfad: Diagnose-
  Cat von `sbkim/spore.json`, Commit der reparierten Spore via
  `git add/commit/push`, lokaler `python3 -m http.server`.
- Code-Änderungen an `index.html` / `sbkim-init.js` laufen NICHT
  via Termux — die kommen aus der Bau-Sitzung als PR.

**Optionale Folge-Pflegen** im Brief erwähnt:
- Backup-Routine etablieren (monatlicher `exportBackup`).
- Pages-Cache-Header prüfen (eigene Mini-Pflege Karte 09 § Schritt
  7).

---

## Was diese Sitzung NICHT geändert hat

- **KEINE Modul-Code-Änderung** (`src/modules/*.js` unangetastet).
- **KEINE Spec-Änderung** an Karten / INTERFACES — Karte 15 / 16 /
  09 bleiben verbindlich; der Rückbau ist scope-disziplin pro
  Endknoten-Repo, kein Spec-Vertragsbruch.
- **KEIN Eingriff in CLAUDE.md** — Pipeline-Erweiterung steht in PR
  #163 (Draft); diese Notfall-Pflege ist parallel zum Spec-Pfad, kein
  Pipeline-Schritt.
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump.**
- **KEIN Sichttest nötig** (reine Brief-Anlage; keine ausführbaren
  Code).
- **KEINE `status.json`-Änderung** (Modul 17 entsteht erst in der
  Spec-Sitzung; diese Pflege ist davor).

---

## Nächster sinnvoller Schritt

1. **PR mergen** (Draft → Ready → Merge auf Klaus' Zuruf). Klein,
   additiv, sicher.
2. **Rückbau-Sitzung in Mein-Rezeptbuch starten** — Brief-Codeblock
   aus `BRIEF_RUECKBAU_15_16_ENDKNOTEN.md` als ersten Prompt. Branch
   `claude/rueckbau-15-16` im Endknoten-Repo. ~2 h Sitzung. Phase
   A0 ist die wichtigste — Klaus EXPLIZIT informieren, was die PR-
   Historie ergibt, bevor Phase B startet.
3. **Phase F (Klaus' Browser-Arbeit) nach Sitzungs-Merge** — Pfad
   nach Phase-A-Diagnose-Befund wählen (F2 / F3 / F4 / F5).
4. **Zweiten Endknoten (Mein-Mixarium) parallel oder direkt
   anschließend rückbauen** — Brief-Inhalt identisch.
5. **Danach: PR #163 mergen** (Spec-Sitzung-17-Floating-Widget-
   Brief steht), **Spec-Sitzung 17 starten** (Pipeline-Schritt 5b),
   **Bau-Sitzung 17** (5c), **Re-Migration mit Widget** (5d),
   **App-Freigabe** (6).

**Reihenfolge wichtig:** Rückbau ZUERST (diese PR), dann Widget-
Spec/Bau/Migration. So sind die Endknoten in einem sauberen Pre-
Migration-Stand und nehmen das Widget frisch auf, ohne Reste der
ersten Migration.
