# Mini-Pflege 2026-05-17 — Vision-Anker (V1 / V3 / Universum)

**Sitzungs-Rolle:** Mini-Pflege, headless (kein Sichttest nötig).
Branch `claude/pflege-vision-anker`. Folge zur Mini-Pflege Live-
Channel-Handshake (PR #77 `7c08b88`).

Hintergrund: nach erfolgreichem Live-Cross-Knoten-Handshake (PR #77)
hat Klaus drei langfristige Visionen geäußert, die nicht verloren
gehen sollen, ohne dass sie sofort Spec oder Bau auslösen. Diese
Pflege legt einen neuen PULS-Block **§ Vision-Anker** an (parallel
zu § Schutz-Backlog und § Diffusion-Backlog) und trägt drei
Vision-Anker mit Datum, Sitzungs-Bezug, Konzept-Skizze und
ungefährer Größenordnung ein.

---

## Die drei Vision-Anker

### 1. Sage als Hybrid-Knoten (Variante I)

Klaus' Bild: die Ameisenkönigin bleibt eine Ameise, auch wenn sie
sich nicht vom Fleck bewegt. Sage-Protokol kann **Hub bleiben UND
zugleich ein vollwertiger Endknoten werden** — selbstreferenziell
wie ein Mycel, das seine eigene Karte ist.

Konsequenzen (Spec-Sitzungs-Aufgabe, nicht jetzt umsetzen):

- CLAUDE.md umschreiben (Satz „Sage ist kein Endknoten" fällt)
- INTERFACES.md § Endknoten-Liste nimmt Sage auf
- `status.json` § endknoten bekommt `sage`-Eintrag
- Sage-Page lädt alle SBKIM-Module mit voller `init()`-Kette
- Sage's Domäne klären (Vorschläge: Mycel-Bibliothek / SBKIM-
  Glossar / Sage-Observatorium)
- IndexedDB-Suffix `sbkim_sage`, App-SW-Variante 3a
- Schwarz-Loch-Karte könnte Andock-Wizard auslösen (siehe V3)

**Status:** reif für Spec-Sitzung. Klaus' Wahl: nächste Phase
nach dieser Mini-Pflege.

### 2. Niedrigeres Onboarding (Variante III-Ausbau)

Klaus' Kritik trifft: **Karte 09's 9 Schritte schrecken ab.**
Verbreitung steht im Konflikt mit Andock-Hürde.

Drei Ausbau-Pfade:

1. **Andock-Wizard als Standalone-PWA** unter
   `.../Sage-Protokol/andock/` — führt durch alle 9 Schritte mit
   Pre-Flight-Checks und Auto-Generierung der Repo-Dateien.
2. **SBKIM-PWA-Distribution mit GitHub-Identität als Geschenk-
   Paket** — GitHub-Action erzeugt automatisch ein Endknoten-Repo
   für einen Nutzer.
3. **Eigener Browser-Wrapper (Fern-Vision)** — Electron / Tauri /
   Capacitor mit SBKIM eingebacken, eigener „aggressiverer"
   Browser, der Browser-Eigenheiten aus § Browser-Observatorium
   umgeht.

Verhältnis zu Schutz-Backlog: sobald SBKIM aus dem Klaus-Kreis
herausgeht, werden Module 10/11/12 akut.

**Status:** reif für Vor-Diskussion, aber noch nicht für Spec.

### 3. Browser-Observatorium-Universum (visuelle Variante)

Aus dem Stil-Sitzungs-Gespräch zur Schwarz-Loch-Karte: das
Observatorium kann auch als **bildlich-animiertes Mini-Universum**
in der Sage-Page direkt leben — sieben Sterne / Galaxien für die
sieben Lehren, jeder mit Twinkling und Parallax, Klick öffnet
Lehre-Modal mit gerendertem md-Text.

Pflege-Disziplin: die md (`docs/OBSERVATORIUM_BROWSER.md`) bleibt
Wahrheits-Quelle. Universum liest sie clientseitig mit einem
minimalen md-Parser (~80 Zeilen JS, keine externe Bibliothek —
Single-File-PWA-Stil ist Konvention). Pflege geht in der md; jede
neue Lehre wird automatisch zu einem neuen Stern.

Pädagogischer Sinn: komplexe Themen durch Bilder zugänglich
machen, ohne den Text-Pfad zu verlieren. Spricht jüngere Leser
und Bilder-Menschen an, „reiner Text"-Link bleibt für Programmierer.

**Status:** reif für eigene Bau-Sitzung, jederzeit zwischen V1-
und V3-Bau einschiebbar.

---

## Was eingetragen

- **`docs/PULS.md`** neuer Block **§ Vision-Anker** (zwischen §
  Diffusion-Backlog und § Sitzungs-Einträge), mit den drei Vision-
  Ankern in voller Tiefe (Konzept-Skizze + Größenordnung + Status
  pro Anker).
- **`docs/PULS.md` § Sitzungs-Einträge** neuer Top-Eintrag „Mini-
  Pflege — Vision-Anker (V1 / V3 / Universum)".
- **Übergabeprotokoll:** dieses Dokument.

`status.json` nicht geändert — Visionen sind keine Modul-Stände.
`update_puls_pie.py` nicht aufgerufen.

---

## Was nicht angefasst

- Modul-Karten (00-14).
- INTERFACES.md (Spec-Stand bleibt fest).
- `src/`-Code.
- Sage-Page (`index.html`) — der Universum-Anker ist nur eine
  Vision, kein Bau.

---

## Nächster sinnvoller Schritt

1. **Klaus:** Diese Pflege-PR mergen.
2. **Spec-Sitzung „Sage als Hybrid-Knoten (Variante I)"** als
   nächste Phase (Klaus' explizite Wahl). Eigener Brief, eigener
   Branch. Klärt CLAUDE.md-Umschreibung, INTERFACES.md-Aufnahme,
   Sage's Domäne, Module-Lade-Strategie, App-SW-Variante. **Kein
   Bau-Code in der Spec-Sitzung** — nur Verträge.
3. **Danach Bau-Sitzung „Sage als Endknoten"** als eigene Phase.
4. **V3 und Universum** warten in § Vision-Anker auf ihre Zeit;
   Spec/Bau wann immer Lust ist.

---

## Konvention für die übernächste Sitzung (IMMER drinhalten)

Wenn Klaus am Sitzungsende der **Folge-Sitzung** `Befehl schreiben`
tippt, formuliert die Folge-Sitzung **vor** dem Brief:

1. **Offene PRs auflisten** in Sage-Protokol (und ggf. Endknoten).
2. **Pro PR eine Einordnung** (mergen / schließen / lassen +
   Konflikt-Risiko, typisch PULS.md / INTERFACES.md).
3. **Den Brief gegen `main`-Stand schreiben**, nicht gegen die
   eigene Branch-Erwartung. Voraussetzungen aus ungemergten PRs
   **explizit** nennen.
4. **Bei mehreren offenen PRs** Merge-Empfehlung vor dem Brief
   vorlegen; der Brief kommt erst nach Klaus' Bestätigung der
   Merge-Strategie (oder explizit „Brief auf aktuellem Stand,
   keine Merges").

Brief-Stil sachlich, ohne Imponiergehabe, mit konkreten Datei-/
Zeilen-Referenzen.

**Pflicht am ENDE des Briefs:** Vollständiger Brief NOCHMAL in
einem einzigen kopierbaren Markdown-Codeblock (Outer-Fence mit vier
Backticks, damit interne ```js-Blöcke nicht schließen).

---

**Vorgänger:** Mini-Pflege Live-Channel-Handshake (PR #77,
`7c08b88`); Mini-Pflege Bau-Sichttest (PR #76, `8801896`); Bau
BroadcastChannel-Bridge (PR #75, `b8c8f41`).

**Branch:** `claude/pflege-vision-anker`.
