# Brief — Bau-Sitzung Such-Feld-Dual-Modus in Mein-Mixarium (extern)

**Anlass:** Schwester-Brief zu `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`.
Klaus' Mein-Mixarium bekommt denselben Dual-Modus-Such-Pfad — nur
über Cocktails/Mocktails statt Rezepten. Beide Endknoten müssen
laufen, sonst ist der Cross-Knoten-Test halb-blind.

**Repo:** `lausiklauskn-png/Mein-Mixarium` (extern, **NICHT
Sage-Protokol**).

**Pipeline-Stellung:** Phase A Pipeline-Schritt 5i (Such-Feld-
Integration-Pattern in Endknoten — siehe CLAUDE.md im Sage-Protokol-
Repo).

**Voraussetzungen:**

- Bau 04.C ist in Sage-Protokol gemerged → `src/modules/04_match.js`
  hat `queryLocal` + `setLocalCorpus`.
- Modul 03 (Embedding) ist im Endknoten geladen.
- Modul 15 Sub (b) postMessage-Bridge ist im Endknoten geladen
  (BroadcastChannel `sbkim-membrane`).
- Mein-Mixarium hat ein bestehendes Such-Feld in der Navleiste
  (Klaus prüft).

**Branch-Vorschlag (im Endknoten-Repo):** `claude/suchfeld-dual-modus`

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung im Endknoten-Repo)

```
Du bist eine Bau-Sitzung in Mein-Mixarium (externes Endknoten-Repo,
NICHT Sage-Protokol).

Sitzungs-Rolle: Bau-Sitzung Such-Feld-Dual-Modus — analog
Mein-Rezeptbuch, aber Cocktails/Mocktails/Drinks als Korpus.
Bidirektionales Cross-Knoten-Matching-Anker.

Branch: claude/suchfeld-dual-modus (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (sofern vorhanden).
2. Eigene index.html — finde das bestehende Such-Feld.
3. Sage-Protokol docs/components/18_tool_pwa.md § Such-Feld-
   Integration-Pattern (insbesondere § Dual-Modus-Klassifikation
   + § Such-Helper + § Sender-Helper-Code-Pattern + § UI-Pattern
   + § Anker-Pfad + § Edge-Cases).
4. Sage-Protokol src/modules/04_match.js § queryLocal.
5. Eigener sbkim/15_membran.js — Sub (b) op:"query"-Empfänger-Kette.
6. Schwester-Brief BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md im Sage-
   Protokol-Repo (selbe Schritte, anderer Korpus).

Deine Aufgabe (analog Mein-Rezeptbuch-Brief, hier kompakt):

A. **sbkim/04_match.js auf Bau-04.C-Stand kopieren.**
B. **Korpus aufbauen:** pro Cocktail/Mocktail/Drink ein
   {label, anchorId, passageVec}-Eintrag via Modul 03.
   anchorId = Drink-Slug. `setLocalCorpus(corpus)` einmalig.
C. **classifySearch** (3 Signale: Wort-Anzahl ≤ 3, kein Fragezeichen,
   kein Bridge-Word — Code aus Karte 18).
D. **runSearch:** Stichwort → lokaler Substring-Filter über Drink-
   Titel + Kategorien (Cocktails/Mocktails/Alkfr./Smoothies/Limonaden/
   Tees/Bowlen/Sirup). Semantik → queryLocal + sendCrossKnotenQuery
   parallel.
E. **sendCrossKnotenQuery** (BroadcastChannel-basiert, 3 s Timeout
   pro Geschwister).
F. **UI-Pattern** zwei Sektionen: "Lokal (Mein-Mixarium)" + "Aus dem
   Mycel (Rezeptbuch)". Cross-Knoten-Links zu
   `https://lausiklauskn-png.github.io/Mein-Rezeptbuch/#anchor=<id>`.
G. **Anker-Pfad bei Boot prüfen** — wenn `window.location.hash` mit
   `#anchor=` startet, scrolle auf den passenden Drink.
H. **Sichttest:**
   - Eingabe "Margarita" → Stichwort, lokal-Treffer "Klassische
     Margarita".
   - Eingabe "welcher Drink zu Lasagne?" → Semantik, lokal-Treffer
     (z.B. Chianti Mocktail) + Cross-Knoten zu MR.
   - Eingabe leer → "leer"-Modus.
   - Rezeptbuch offline → 3 s Timeout, leere Mycel-Sektion.
I. **Konsole-Hinweise** wie im MR-Brief.

Was du nicht tust:

- KEIN Modul-04-/Modul-15-Code-Eingriff.
- KEINE Sage-Protokol-Branche/PR.
- KEIN Auto-Sender beim Boot.

Pflicht am Ende:

- sbkim/04_match.js auf Bau-04.C-Stand.
- Korpus-Aufbau + setLocalCorpus.
- classifySearch + runSearch + sendCrossKnotenQuery + UI-Pattern.
- Anker-Pfad-Hook bei Boot.
- Sichttest 4 Punkte durch Klaus.
- Commit + Push auf claude/suchfeld-dual-modus.
- Draft-PR im Endknoten-Repo.
- Endknoten-CLAUDE.md aktualisieren (sofern vorhanden).
```

---

## Hintergrund

Schwester-Brief zu MR. Mein-Mixarium liefert die Cocktail-/Drink-
Seite des Cross-Knoten-Matches. Beispiele:

- MR-Anfrage „welcher Wein zu Gulasch?" → MM antwortet mit
  Rotwein-Empfehlungen (Cocktail-/Drink-Korpus deckt Wein-
  Kategorie ab).
- MM-Anfrage „welcher Snack zu Margarita?" → MR antwortet mit
  Knabber-Rezepten (Gast-Kategorie „Knabbereien / Fingerfood").

Klaus' Mein-Mixarium hat acht Stamm-Kategorien (Cocktails,
Mocktails, Alkfr. Cocktails, Smoothies & Shakes, Limonaden, Tees
& Kaffees, Bowlen, Sirup & Basis) + zwei Gast-Kategorien
(Knabbereien / Fingerfood — siehe PULS Endknoten-Tabelle).

## Nach dieser Sitzung

- **Cross-Knoten-Sichttest** (gemeinsamer Sichttest mit MR-PR —
  siehe Endstand-Codeblock im MR-Brief).
- **Folge-Pflege:** UI-Polish, Debounce, Score-Anzeige.

## Heilige Tafeln dieser Sitzung

- KEIN Modul-04-/Modul-15-Code-Eingriff.
- KEINE Sage-Protokol-Branche/PR.
- KEIN Auto-Sender beim Boot.

---

**Endstand-Codeblock für die übernächste Sitzung** (Cross-Knoten-
Sichttest) — identisch mit dem in `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MR.md`
beschriebenen Sichttest-Plan.
