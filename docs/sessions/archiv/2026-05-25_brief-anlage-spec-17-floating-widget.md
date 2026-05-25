# Übergabeprotokoll — Brief-Anlage + Pipeline-Anpassung Spec-Sitzung 17 Floating-Widget

**Datum:** 2026-05-25
**Sitzungs-Rolle:** Mini-Pflege (Brief-Anlage + Pipeline-Anpassung,
kein Modul-Code-Eingriff, keine Spec-Inhalts-Pflege)
**Branch:** `claude/brief-spec-15-16-floating-widget`
**Auslöser:** Klaus' Live-UI-Sichttest am Tablet 2026-05-25 nach der
ersten Endknoten-Migration (Mein-Rezeptbuch + Mein-Mixarium nach PR
#162). Befund im Chat: Lampen + Siegel in der Navleiste nehmen zu
viel Platz, nicht einheitlich, kein User-X-Schließen, kein Drag.

---

## Klaus' UI-Befund + Architektur-Forderung

> **Mein-Rezeptbuch:** Lampen + Siegel-Badge nehmen zu viel Platz in
> der oberen Navleiste.
>
> **Mein-Mixarium:** Navleiste vollständig ausgefüllt.
>
> „Am besten wäre es natürlich, wenn diese Siegel oder diese in
> einem beweglichen Tab oder in einem beweglichen Modul, so ähnlich
> wie Eruda, das Tool, auch frei beweglich irgendwo hingesetzt
> werden können. Sie könnten dann auch selber entscheiden, ob Sie's
> wegklicken mit einem x oder nicht. […] Wir müssen uns auf ein
> einheitliches Modul einigen, das jederzeit weitergegeben werden
> kann."

Architektur-Befund auf vier Achsen:

1. **Container-Anker-Pflicht** (`.lamps`) ist nicht universal — manche
   Endknoten haben keinen Navleisten-Container in dieser Form.
2. **CSS-Variablen-Kopier-Pflicht** (`--lamp-alert`, `--siegel-gold`,
   etc. aus Sage-Page) ist hoher Einbau-Aufwand und produziert genau
   die Inkonsistenzen, die Klaus jetzt sieht.
3. **Kein User-Schließ-Pfad** — Anti-Greenwashing-Klausel falsch
   interpretiert (sie verbietet nur Anzeigen ohne Selbst-Prüfung-
   grün, nicht User-Verbergen).
4. **Kein Drag** — Position hartkodiert in der Navleiste.

Tafel-Evolutions-Klausel (CLAUDE.md § Heilige Tafeln) erlaubt das:
alter Vertrag (Karte 15 § Sub (e) Navleisten-Lampe + Karte 16 § Sub
(b) Badge-Rendering mit `.lamps`-Container) war scope-bezogen auf
die Sage-Page-Optik; Klaus' UI-Befund zeigt, dass das für fremde
Endknoten nicht skaliert. Bewusste Anpassung statt stillschweigendes
Umgehen.

---

## Was getan

**Reine Doku-Pflege**, drei Eingriffe:

### 1. Neue Brief-Datei `docs/sessions/BRIEF_SPEC_15_16_FLOATING_WIDGET.md`

~270 Zeilen Brief-Codeblock mit **17 Spec-Punkten** für die nächste
Spec-Sitzung. Kern-Idee: ein gemeinsames **Floating-Widget (Modul
17)** bündelt FREMD-Lampe + Siegel-Badge in einem self-mountenden
Mini-Panel (Eruda-Stil). Spec-Punkte:

- Modul-Name + Funktions-Surface (`window.SbkimWidget = {init,
  show, hide, isVisible, getPosition, _meta}`).
- Self-Mount in `<body>` — kein Container-Anker im Endknoten-HTML,
  keine CSS-Variablen-Kopier-Pflicht. Standalone-CSS inline im
  Widget-Script.
- Layout: kompakte Pille ~80–100 px × 40 px, FREMD-Lampe + Siegel-
  Badge nebeneinander.
- Default-Position: `defaultCorner: "bottom-right"` mit 16 px Abstand;
  vier Ecken erlaubt.
- Drag-Mechanik: Pointer-Events-API (Touch + Mouse), Drag-Threshold
  ~5 px, optionaler Snap-zu-Ecken.
- Persistierung: `localStorage` mit Schema `sbkim_widget_visible` +
  `sbkim_widget_position`.
- X-Schließen mit vier Wiederherstellungs-Pfaden (DevTools-Knopf /
  5-Klick-Geste / Doku-Fenster-Knopf / persistent respektieren).
- Modal-Verhalten unverändert: Klick auf Lampe → Sub-(e)-Modal von
  Modul 15; Klick auf Badge → Erklärungs-Modal von Modul 16.
- Eruda-Kollisions-Check: `defaultCorner` konfigurierbar.
- Sage-Page-Pfad: behält Navleisten-Lampen (Klaus-Festlegung); Widget
  ist Endknoten-Standard.
- API-Signatur `SbkimWidget.init({allowedOrigins, repoUrl,
  defaultCorner, defaultOffset, allowClose, allowDrag,
  enableTestButton})`.
- Modul 15 + 16 Backends UNVERÄNDERT — nur die Render-Schicht
  wandert. `lampSelector` / `badgeSelector` als Spec-konforme
  Optionen bleiben, Widget setzt sie intern.
- `ZERTIFIKAT_ASPEKTE`-Eintrag pflichtig (CLAUDE.md § „Sicherheits-
  Module pflegen Aspekte").
- Karte 09 § Schritt 10 + 11 vereinfachen auf je drei Zeilen + neuer
  Schritt 12 (Widget-Einbau, eine Zeile `<script>` + eine Zeile
  `init()`).
- `status.json` + INTERFACES § 1 + § 7 + CLAUDE.md § Modul-Tabelle +
  PULS.md nachziehen.
- Strikte Tabus: keine eigene Identität / Krypto / IndexedDB / Netz /
  Replay-Cache; kein Override der Modul-15-+-16-Modals; keine
  Anzeige bei `isCertified()===false`; kein Disclaimer-Schwall im
  Widget selbst.

Was die Spec-Sitzung NICHT tut (eigene Folge-Sitzungen): Bau-Sitzung
17 Code, Sichttest-Panel-17, Endknoten-Re-Migration mit Widget.

### 2. CLAUDE.md § Pipeline-Reihenfolge erweitert

Drei neue Schritte zwischen Schritt 5 und Schritt 6 eingefügt:

- **Schritt 5** ist jetzt als ⚠️ markiert („erste Iteration mit UI-
  Befund, Re-Migration nach Schritt 5d nötig").
- **Schritt 5b:** Spec-Sitzung 17 Floating-Widget — Brief liegt
  (`BRIEF_SPEC_15_16_FLOATING_WIDGET.md`).
- **Schritt 5c:** Bau-Sitzung 17 — `src/modules/
  17_floating_widget.js` mit Standalone-CSS, Drag, X-Schließen,
  localStorage, Modal-Anker-Bridge. Brief entsteht in Spec-Sitzung
  17.
- **Schritt 5d:** Endknoten-Re-Migration mit Widget — drei-Zeilen-
  Einbau statt 30, alte Navleisten-Lampen + Siegel ausbauen. Brief
  entsteht in Bau-Sitzung 17.

§ „Warum diese Reihenfolge (Begründung)" um fünften Punkt erweitert:
Tafel-Evolutions-Klausel + Klaus' UI-Befund + Sage-Page behält
Navleisten-Lampen.

### 3. CLAUDE.md § Die zehn Module um Modul 17 erweitert

Tabellen-Header von „Siegel-Backlog 16" auf „Siegel-Backlog 16 +
Widget-Backlog 17" umbenannt; neue Zeile für Modul 17 mit
Datei-Pfad `docs/components/17_floating_widget.md` und Status „Spec
ausstehend, **Priorität hoch** (2026-05-25, Auslöser Klaus' UI-
Befund — Navleisten-Mount nicht skalierbar; Floating-Modul wie Eruda
als Endknoten-Standard, Sage-Page behält Navleisten-Lampen)".

---

## Was offen geblieben ist

- **Spec-Sitzung 17 Floating-Widget** — Klaus startet sie mit dem
  Brief-Codeblock als ersten Prompt. Erwartete Dauer ~1.5–2 h.
- **Bau-Sitzung 17** + **Sichttest 17** + **Endknoten-Re-Migration
  mit Widget** — entstehen aus Spec-Sitzung 17 sequenziell.
- **App-Freigabe (Pipeline-Schritt 6)** — nach Re-Migration.
- **Optionale Folge-Pflegen vor App-Freigabe** (im Brief erwähnt):
  Modul 00 + Widget-Wiederherstellung verknüpfen; Eruda-Kollisions-
  Hinweis in Karte 09; Mobile-spezifische Widget-Variante.

## Was diese Sitzung NICHT geändert hat

- **KEINE Modul-Code-Änderung** (`src/modules/*.js` unangetastet).
- **KEINE Spec-Änderung** an Karte 15 / 16 / INTERFACES § 1 Modul 15
  / 16 — die sind Tafeln; die Spec-Sitzung 17 zieht einen Verweis-
  Block an das Ende, KEIN Inhalts-Override.
- **KEIN neuer Karte-17-Inhalt** — die Karte entsteht erst in der
  Spec-Sitzung 17.
- **KEIN Eingriff in `BRIEF_BAU_ENDKNOTEN_MIGRATION_MULTI_IDENTITY.md`**
  — der bleibt für die erste Migration (gelaufen) historisch
  gültig; die Re-Migration in Schritt 5d kriegt einen eigenen
  kleineren Brief, der in Bau-Sitzung 17 entsteht.
- **KEIN `PROTOCOL_VERSION`-/`DB_VERSION`-/`BACKUP_FORMAT_VERSION`-
  Bump** (Modul 17 ist nicht protokoll-aktiv — reine UX-Schicht).
- **KEINE `status.json`-Änderung** — Modul 17 ist noch Schablone,
  kein Score-Eintrag nötig; das Pie-Diagramm wird in der Spec-
  Sitzung 17 nach Karte-Anlage regeneriert.
- **KEIN Sichttest nötig** (reine Doku + Brief-Anlage; kein
  ausführbarer Code).

---

## Nächster sinnvoller Schritt

1. **PR mergen** (Draft → Ready → Merge auf Klaus' Zuruf). Die
   Anpassung ist klein und additiv.
2. **Spec-Sitzung 17 starten** mit `BRIEF_SPEC_15_16_FLOATING_WIDGET.md`
   Codeblock als ersten Prompt. Branch-Vorschlag im Brief:
   `claude/spec-15-16-floating-widget`.
3. Danach **Bau-Sitzung 17** (Brief entsteht in Spec-Sitzung 17).
4. Danach **Sichttest 17 + Endknoten-Re-Migration mit Widget**.
5. Danach **App-Freigabe** Pipeline-Schritt 6 — die drei Apps mit
   sauberem Widget statt eingequetschter Navleiste verteilen.

Bis zur App-Freigabe **bleibt die Pipeline klar sequenziell**: jede
Sitzung wartet auf die vorhergehende, keine Parallel-Bauten.
