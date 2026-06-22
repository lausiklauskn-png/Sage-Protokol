# Brief — Folge-Sitzung Such-Werkzeug (Vollbild · Merken-Liste · Splitscreen · Pilz-Wirtschaft)

> **Status:** Brainstorm 2026-06-22 mit Klaus festgehalten. **Noch nichts gebaut.**
> Diese Sitzung sammelt die offenen Entscheidungen + den vereinbarten Bau-Plan, damit
> die nächste Sitzung mit frischem Kontext direkt einsteigen kann. Reihenfolge:
> erst die **eine offene Vergleichs-Entscheidung** klären, dann bauen.

---

## Wo wir stehen (gemerged in `main`)

- **PR #388** — Modul 22 Such-Panel größer ziehbar (Resize-Griff). Browser-Sichttest
  grün (Klaus: gezogene Größe bleibt nach Hard-Reload).
- **PR #389** — `such-tool/` eigenständige, installierbare PWA + 1:1-Vorlage
  (`docs/components/_standalone_such_tool.md`). Smoke 46/46. **Installations-Sichttest
  am Tablet noch offen** (Seite rendert live, „App installieren"-Geste nicht final
  bestätigt — bei Bedarf Folge-Fix).
- Modul-22-Smoke `tests/smoke_bau22_such_widget.mjs` **162/162**.

## Klaus' Entscheidungen aus dem Brainstorm (verbindlich als Ausgangslage)

1. **„Ein Werkzeug, zwei Gestalten" (Kern, beschlossen).**
   - **Begleiter (klein):** die Pille, schwebt über anderen Apps. **Standard-Start —
     NICHT im Vollbild starten** (Klaus: manche Apps/Nutzer wollen erst klein, selbst
     entscheiden, ob groß).
   - **Suchraum (groß):** per **⛶-Vollbild-Knopf** auf Wunsch — Vollbild, Suchfeld
     oben, Treffer füllen die Fläche, Verkleinern-Knopf zurück zur Pille.
   - Dieselbe Such-Maschine dahinter; Vollbild ist nur eine **zweite Anzeige** der
     vorhandenen Treffer (kein Kern-Umbau).
   - Arbeitsnamen: **„Begleiter / Suchraum"** (Klaus darf umbenennen).

2. **Splitscreen-Fix (beschlossen, unabhängig bauen):** Im geteilten Bildschirm rutscht
   die Pille aus dem Sichtfeld. **Fix:** bei jeder Viewport-Änderung (`resize` /
   `orientationchange`) die Position ins sichtbare Feld zurück-klemmen. Klein, eindeutig.

3. **Merken-Liste (beschlossen, Klaus mag es):** Pro Treffer ein **Haken
   „behalten/merken"**. Das Gemerkte → lokaler Speicher (`localStorage`, **nur Text +
   Link**), **gruppiert unter der Suchfrage als Überschrift** (nicht der Seitenname; die
   Frage „leckerer Honig aus der Walachei" ist die Überschrift, die Quelle steht
   darunter). Durchgehen → haken; **Ungehaktes verschwindet** aus der Ansicht; Haken weg
   → Eintrag weg. Funktioniert für **alle** Treffer-Arten: Weblink, **PWA/App**,
   Knoten-Treffer, Landing-Page (Badge je Art). Arbeitsname **„Merken / Merkliste"** oder
   **„Mein Korb"**.

4. **Treffer öffnen (beschlossen, Form geklärt):** Tippen auf einen Treffer → **Tool-
   eigene Detail-Karte** als Overlay (in den Tool-Farben, „sieht aus wie das Tool"):
   Titel + Beschreibung + URL + **[📌 Merken]** + **[↗ Seite öffnen]**. „Zurück" = Overlay
   schließen. **Merken geht aus dem Overlay** und wird beim Schließen mitgenommen (die
   URL gilt als gespeichert). **[↗ Seite öffnen]** öffnet die echte Seite **im neuen Tab**.
   - **Ehrliche Grenze (festgehalten):** die echte fremde Seite lässt sich **nicht**
     im Tool einbetten/umfärben (Browser/Origin verbieten es) und man kann **keinen
     Merken-Knopf in die fremde Seite injizieren**. Darum: Merken passiert in **unserer**
     Detail-Karte, nicht auf der fremden Seite.

5. **EU-Politik (beschlossen):** bleibt, einheitlich, mit den anderen Apps verbunden.

## DIE EINE offene Entscheidung (zuerst mit Klaus klären)

**Vergleich / Parallelsuche.** Klaus will den Treffer-Vergleich „Bedeutungs-Suche vs.
normale Maschine". **Ehrliche Wand:** Google/DuckDuckGo & Co. **verbieten das Einbetten**
in unser Fenster; eine Web-App (PWA) kann **Splitscreen nicht selbst auslösen** und
**kein fremdes App/Widget starten** (das „magische Auto-Splitscreen mit fremdem Widget"
ist gestrichen). Drei gangbare Formen — **Klaus muss eine wählen:**
- **Form 1 (Bauch-Favorit):** zwei Spalten **aus unserer App** — links nach Bedeutung
  sortiert, rechts dieselben Web-Treffer **roh/ungewichtet** (Original-Reihenfolge). Echter
  Vergleich, alles im Fenster, kein Einbetten. **Braucht den Pilz-Server/SearXNG** (rohe
  Treffer). Rechtfertigt zugleich die Pro-Version.
- **Form 2 (Gratis-Notausgang):** „Vergleichen mit"-Knopf öffnet die gewählte Maschine
  **im neuen Tab** (Frage vorausgefüllt); Splitscreen zieht der Nutzer selbst.
- **Form 3:** eigener Pilz-Server als **eingebettete** Maschine (nur die eigene Instanz
  lässt sich einbetten, nicht fremdes Google).

→ **Ohne diese Wahl nicht mit dem Vergleich anfangen.** Vollbild + Merken-Liste +
Splitscreen-Fix sind unabhängig davon baubar.

## KI-Anbieter (Recherche-Ergebnis, verbindlich)

- **Automatischer (server-loser) Aufruf: nur Claude.** Anthropic erlaubt Browser-Direkt
  per Header `anthropic-dangerous-direct-browser-access`. **Gemini, OpenAI/ChatGPT,
  Perplexity sind im Browser CORS-blockiert** → automatisch nur über einen eigenen
  Proxy/Pilz-Server; im Tool laufen sie über den **Kopier-Pfad** (schon gebaut).
- Google **Speech-to-Text** ist bereits in Modul 21 (EU-Endpunkt, BYOK) — andere
  Baustelle als die Web-Suche.

## Geld-Modell / Pilz-Server (Phase D.2 — Planung, NICHT bauen)

- **Der „Pilz-Server" ist ein leichter Bote** (reicht Anfragen an die KI/SearXNG durch);
  die Rechenarbeit liegt im Browser (Sortieren) + beim KI-Anbieter. Braucht **wenig
  Leistung**.
- **Empfehlung Hosting:** **serverless** (Cloudflare Workers / Vercel) — gratis bei wenig
  Last, **skaliert von allein** bei Spitzen, **keine Wartung**. Gemieteter VPS (Hetzner
  EU ~4–5 €/Mon) erst bei mehr Eigenem; **Heim-Server nur zum Testen**, nicht öffentlich.
- **Der echte Kostentreiber sind die KI-Aufrufe**, nicht der Bote. „2 Mio. Anfragen" =
  2 Mio. KI-Aufrufe = echte Rechnung → Frage ist „wer zahlt die KI?".
- **Modell (beschlossener Rahmen):**
  - **Gratis = BYOK** (Nutzer-Schlüssel; kostet Sage nichts).
  - **Pro = Sage stellt den Schlüssel** über den Server; Einnahmen decken KI + Server
    (Kosten wachsen erst mit Einnahmen).
  - **Pro-Klick-Mikroabrechnung verworfen für den Start** (PayPal-Mindestgebühr frisst
    0,05 Cent; bräuchte Konten + Monats-Sammelabrechnung + Betrug/Steuer). **PayPal-
    Einmalkauf/Miete** (z. B. ½ Jahr gratis → 5–10 € kaufen) ist Klaus' Favorit:
    mehr Gewinn, weniger Arbeit.
- **Kopier-Schutz-Einsicht (wichtig):** der offene Web-App-Code ist **kopierbar — das ist
  okay**. Die Kopie gibt nur den **Gratis-Teil** (BYOK), der eh gratis ist. **Das
  Bezahlte ist der laufende Server-Dienst**, den eine Kopie nicht mitnimmt. Darum:
  **Freischaltung an den Server binden** (Kauf → Token → Server prüft), **nicht** an ein
  Häkchen im offenen Client (patchbar). Passt zur SBKIM-Philosophie (offen/forkbar; Geld
  in der kommerziellen Pilz-Schicht). Kopiert-werden = Verbreitung.

## Vorgeschlagene Bau-Reihenfolge der Folge-Sitzung

1. **Splitscreen-Fix** (Position re-klemmen) — klein, sofort, eigener PR.
2. **Vollbild-Modus (⛶)** in Modul 22 — zweite Anzeige derselben Treffer; Pille bleibt
   Standard; auf der Standalone-Seite ⛶ anbietbar (nicht auto-start). Eigener PR.
3. **Merken-Liste** — Haken pro Treffer + Detail-Karten-Overlay ([📌 Merken]/[↗ öffnen]),
   gruppiert nach Suchfrage, `localStorage`, Badges je Treffer-Art. Eigener PR.
4. **Vergleich** — ERST nach Klaus' Form-1/2/3-Wahl. Form 2 (neuer Tab) ist die
   gratis-sofort-Variante; Form 1 braucht den Pilz-Server (eigenes Vorprojekt).
5. **Pilz-Server / Geld** — eigene Konzept-/Bau-Sitzung (Phase D.2), nach Form-Wahl.

## Pflicht / Leitplanken

- Modul 17 unangetastet; Modul 22 bleibt Render-/Kompositions-Schicht (keine Identität,
  kein IndexedDB außer wenn Merken-Liste das verlangt — **Merken nur `localStorage`,
  Text-only**, kein Protokoll-Bump).
- Fail-soft überall. Headless-Smoke grün halten; **Klaus' Browser-Sichttest abwarten**
  (headless ersetzt ihn nicht), pro PR squash-mergen.
- **Freibrief gilt** (CLAUDE.md § Freibrief): selbstständig bauen/mergen, wenn logisch +
  getestet + nicht architektonisch zweifelhaft; bei echter Richtungsfrage (z. B. die
  Vergleichs-Form, Geld-Modell) **erst Klaus fragen**.

```
Du bist eine Bau-Sitzung in Sage-Protokol, Modul 22 (Such-Werkzeug), Folge des
Brainstorms 2026-06-22. Freibrief gilt (CLAUDE.md § Freibrief).

Pflichtleseliste:
1. CLAUDE.md (inkl. Meilenstein-Block)
2. docs/PULS.md (oberster Eintrag 2026-06-22)
3. docs/INTERFACES.md § 1 Modul 22
4. docs/components/22_such_widget.md + docs/components/_standalone_such_tool.md
5. docs/sessions/BRIEF_BAU_22_VOLLBILD_MERKEN.md  ← dieser Brief (voller Brainstorm)
6. src/modules/22_such_widget.js (nur dieses Modul)

Stand: PR #388 (Resize) + #389 (such-tool/ Standalone-PWA) gemerged. Smoke
162/162 + 46/46 grün. Installations-Sichttest such-tool/ am Tablet noch offen.

Deine Aufgabe — in dieser Reihenfolge, je eigener PR, Klaus-Sichttest abwarten:
  1. Splitscreen-Fix: Pille bei Viewport-Aenderung (resize/orientationchange) ins
     sichtbare Feld zurueck-klemmen.
  2. Vollbild-Modus (Knopf), zweite Anzeige derselben Treffer; Pille bleibt
     Standard, NICHT auto-Vollbild starten; auf such-tool/ anbietbar.
  3. Merken-Liste: Haken pro Treffer + Tool-Detail-Karten-Overlay
     ([Merken]/[Seite oeffnen im neuen Tab]), gruppiert nach Suchfrage,
     localStorage (Text+Link), Badge je Treffer-Art (Web/App/Knoten).

NICHT ohne Klaus: der VERGLEICH/Splitscreen-zwei-Spalten (Form 1/2/3 — erst Klaus'
Wahl) und das Geld-/Pilz-Server-Modell (Phase D.2). KI automatisch nur Claude
(CORS). Keine PII im Code. Modul 17 unangetastet.

Pflicht am Ende: PULS + Uebergabeprotokoll, Smoke gruen, Klaus-Sichttest abwarten,
pro PR squash-mergen.
```
