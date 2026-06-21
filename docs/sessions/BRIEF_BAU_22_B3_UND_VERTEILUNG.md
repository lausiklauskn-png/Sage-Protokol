# Folge-Brief — Modul 22 Such-Werkzeug: B3, Breitziehen, Verteilung

Stand 2026-06-21. Stufe A + B (Tresor + automatischer Claude-Aufruf) sind gebaut
und **live bestätigt** (CORS geht, Referenzfall Hund+Katze bestanden). Dieser
Brief führt die nächste Sitzung weiter. Voller Werdegang:
`docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md` + Übergabeprotokoll
`docs/sessions/archiv/2026-06-21_bau-22-stufe-b-und-verteilung.md`.

Kopiere den Block unten in den ersten Prompt der neuen Sitzung.

```
Du bist eine Bau-/Pflege-Sitzung in Sage-Protokol, Modul 22 (Such-Werkzeug).
Freibrief gilt (CLAUDE.md § Freibrief): selbstständig mergen/merken, wenn
logisch + getestet + nicht architektonisch zweifelhaft.

Pflichtleseliste:
1. CLAUDE.md (inkl. ⭐-Meilenstein-Block oben)
2. docs/MEILENSTEIN_SEMANTISCHE_SUCHE.md
3. docs/PULS.md (oberster Sitzungs-Eintrag 2026-06-21 Stufe A→B)
4. docs/INTERFACES.md § 1 Modul 22
5. docs/components/22_such_widget.md + docs/components/_such_referenzfaelle.md
6. src/modules/22_such_widget.js (nur dieses Modul)

Stand: Stufe A (KI-Such-Brücke) + B1 (Tresor) + B2 (automatischer Claude-Aufruf,
CORS live) sind gebaut. Smoke tests/smoke_bau22_such_widget.mjs 148/148 grün.

Deine Aufgabe — EINEN der folgenden Stränge (Klaus' Reihenfolge bestätigen):

  (A) SUCH-PANEL BREITER ZIEHBAR — Klaus' Befund: das untere Lesefeld ist eng.
      Einen Resize-Anfasser ans Panel (Breite/Höhe ziehen), Persistenz der Größe
      in localStorage, Mindest-/Maxmaße, Drag-Konflikt mit dem Verschieben sauber
      trennen. Kleiner, sofort spürbarer UX-Gewinn — guter Einstieg.

  (B) B3 — SICHERHEITS-/EIGNUNGS-BEWUSSTER RICHTER. Die Sortierung ordnet nach
      Bedeutungs-Nähe, NICHT nach Eignung/Sicherheit. B3 soll Unsicheres rot
      markieren / herabstufen, Sicheres hochstufen. Gemessen am Goldstandard in
      _such_referenzfaelle.md (Hund+Katze: Permethrin-Mittel runter/rot, orale
      Isoxazoline hoch, „natürlich" ≠ katzensicher). Eigene Such-Schichten statt
      der knoten-getunten fachlich/prozess/skalierung — Modul-04-Querschnitt
      (Hauptsitzung/Abstimmung mit Klaus, da architektonisch).

  (C) STANDALONE-SINGLE-FILE-PWA-DOWNLOAD. Eine herunterladbare index.html, die
      Modul 22 + Abhängigkeiten (03/04, optional 21) + Manifest + Service-Worker
      bündelt — installierbar als eigene PWA. Bekommt eine EIGENE Fußzeile
      (Impressum/Datenschutz, analog impressum.html). Ergänzt die Werkzeugkiste-
      Kachel (Stufe 1 Embed-Snippet ist schon da).

Was du NICHT ohne Klaus tust: Modul-04-Eingriff (B3) ist Querschnitt — erst
abstimmen. Keine personenbezogenen Daten in den Code.

Pflicht am Ende: PULS aktualisieren · Übergabeprotokoll · Smoke grün halten ·
Klaus' Browser-Sichttest abwarten (headless ersetzt ihn nicht) · pro PR squash-
mergen.
```

## Weitere offene Punkte (nicht Teil des Haupt-Strangs, aber im Blick behalten)

- **Klaus' Browser-Sichttests** der neuen Felder (Tresor-🔐-UI, Fortschrittsbalken,
  ⚡ Automatisch) am Galaxy-Tab-S6 — headless ersetzt sie nicht.
- **Endknoten-Einbau-Test** (Mein-Mixarium / Mein-Rezeptbuch) — externes Repo,
  eigene Sitzung dort; hier nur Embed-Snippet + Anleitung bereitstellen.
- **Bidirektionale Cross-Knoten-Suche** server-los end-to-end (Meilenstein §4) —
  braucht ≥2 echte Knoten; Modul 04.C + 15 Membran `op:"query"`.
- **PULS-Überlauf** (5882 > 3000 Zeilen) — Archiv-Auslagerung als eigene
  Wartungs-Sitzung (NICHT kürzen, auslagern — siehe PULS-Schutz-Klausel).
- **PR #302** (BLP-E2E-Antwort, Draft 2026-06-19) — Klaus-Entscheid mergen/lassen.
- **SB-KIMTool-Point** — Klaus relayt den Brief (Such-Tool übernehmen +
  Breitziehen + Impressum/Datenschutz in seine PWA-App integrieren).
