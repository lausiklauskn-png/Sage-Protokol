# Übergabeprotokoll — Pflege Karte 09 § Schritt 12 (2026-05-25)

## Sitzungs-Rolle

Doku-Folge-Pflege nach Modul-17-Bau + drei UX-Pflegen (PR #166–#169 alle
gemerged 2026-05-25). Pipeline-Schritt 3 der Bau-17-Folge-Schritte-Liste,
vor Endknoten-Re-Migration. Branch `claude/pflege-09-widget-einbau`.

## Anlass

Modul 17 (Floating-Widget) ist Endknoten-Standard-Render-Schicht.
Karte 09 § Andock-Schritt-Pfad braucht den Drei-Zeilen-Einbau dokumentiert
+ Init-Reihenfolge-Pflicht prominent. Schritte 10 + 11 (Navleisten-Mount)
sind nicht mehr Endknoten-Standard, sondern Sage-Page-Pfad.

## Was getan

### 1. Karte 09 § Andock-Schritt-Pfad-Überschrift

Von „neun Schritte" zwischenzeitlich „elf Schritte" (Pflege 2026-05-25
Module 15 + 16) jetzt erweitert auf „elf Schritte + Render-Schicht
Schritt 12".

### 2. Hinweis-Block vor Schritt 10 + 11

Prominenter `⚠ Pflege 2026-05-25`-Block ergänzt:

- Schritte 10 + 11 = **Sage-Page-Pfad** (Navleisten-Lampen + Siegel-Badge
  in `index.html`).
- **Endknoten** (Mein-Rezeptbuch, Mein-Mixarium, künftige Forks) bauen
  Modul 15 + 16 NICHT selbst in die Navleiste — sie nutzen das Floating-
  Widget (Modul 17, Schritt 12).
- Click-Handler werden automatisch an Widget-interne Proxy-Spans
  attached (`#lamp-fremd`, `#sbkim-siegel-badge`).
- Schritte 10 + 11 bleiben als Referenz für Sage-Page + Forker mit
  Navleisten-Bevorzugung.

**Inhalt von Schritt 10 + 11 selbst** ist UNVERÄNDERT (das ist die volle
Sage-Page-Anleitung).

### 3. Neuer Schritt 12 — Floating-Widget (Modul 17, Endknoten-Standard)

Eingefügt zwischen Schritt 11 und § Sichtkontrolle. Inhalt:

- **Drei-Zeilen-Einbau** (Modul-Datei-Kopie + `<script>`-Tag + EIN
  `SbkimWidget.init({allowedOrigins, repoUrl})`-Aufruf).
- **Init-Reihenfolge-Pflicht** prominent: `SbkimWidget.init()` MUSS VOR
  `SbkimMembrane.init()` / `SbkimSiegel.init()` im Endknoten-Andocker
  stehen — sonst finden Modul 15/16 ihre Mount-Anker (Proxy-Spans im
  Widget) nicht.
- **Erwartung nach Hard-Reload** (Floating-Pille bottom-right, vier
  Lampen + Labels, Drag/X-Schließen/Minimize, Slot-Klicks öffnen
  Modul-17- oder Modul-15-/-16-Modals).
- **Theme-Anpassung** via `:root`-CSS-Variablen-Override + `theme:
  "transparent"`-Option dokumentiert.
- **Fallback-Hinweis** für Forker, die bewusst die Navleisten-Optik
  bevorzugen (Schritte 10 + 11 bleiben gültig).

### 4. Karte 09 § Bauzustand

Neue Zeile „Pflege Schritt 12 — Floating-Widget als Endknoten-Standard"
2026-05-25 ergänzt mit voller Detail-Beschreibung.

### 5. INTERFACES.md § 10 Änderungsprotokoll

Neuer Eintrag „Pflege Karte 09 § Schritt 12 — Floating-Widget als
Endknoten-Standard" mit voller Beschreibung der drei Karten-09-Eingriffe.

## Was offen blieb

- **Endknoten-Re-Migration Mein-Rezeptbuch** — externe Sitzung im Endknoten-
  Repo. ~1.5 h. Drei-Zeilen-Einbau aus Karte 09 § Schritt 12 anwenden.
- **Endknoten-Re-Migration Mein-Mixarium** — analog, externe Sitzung.
- **App-Freigabe** (Pipeline-Schritt 6) nach beiden Re-Migrationen.
- **Spec-Sitzung Tool-PWA-Container für SIEGEL** — Klaus' Idee aus
  Sichttest 17, kommt nach App-Freigabe.

## Pflicht am Ende

- Karte 09 § Andock-Schritt-Pfad-Überschrift + Hinweis-Block + neuer
  Schritt 12 + Bauzustand ✅
- INTERFACES.md § 10 Änderungsprotokoll ✅
- PULS.md Sitzungs-Eintrag ✅
- Übergabeprotokoll (diese Datei) ✅
- **KEIN Modul-Code-Eingriff** ✅
- **KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump** ✅
- **KEINE Sage-Page-Änderung** (`index.html` unangetastet) ✅
- **KEINE Karte-15-/-16-/-17-Spec-Änderung** ✅
- **KEINE Pipeline-Reihenfolge-Umsortierung in CLAUDE.md** ✅
- `status.json` Modul 09 unverändert (bleibt `score:"fertig"`) ✅

## Nächster sinnvoller Schritt

Endknoten-Re-Migration starten (eigene externe Sitzung pro Endknoten-
Repo). Brief-Codeblock in der finalen Chat-Antwort der aktuellen
Sitzung (Konvention CLAUDE.md Pflicht-6).
