# Brief — Bau-Sitzung Such-Feld-Dual-Modus in Mein-Rezeptbuch (extern)

**Anlass:** Bau-Sitzung 04.C `queryLocal` (Sage-Protokol, 2026-05-26)
hat das lokale Such-Backend in Modul 04 fertiggestellt. Karte 18 §
Such-Feld-Integration-Pattern hat die Dual-Modus-Spec (Stichwort vs.
Semantik) voll ausgeführt. Diese Bau-Sitzung setzt das Pattern in
Klaus' Mein-Rezeptbuch um.

**Repo:** `lausiklauskn-png/Mein-Rezeptbuch` (extern, **NICHT
Sage-Protokol**).

**Pipeline-Stellung:** Phase A Pipeline-Schritt 5i (Such-Feld-
Integration-Pattern in Endknoten — siehe CLAUDE.md im Sage-Protokol-
Repo).

**Voraussetzungen:**

- Bau 04.C ist in Sage-Protokol gemerged → `src/modules/04_match.js`
  hat `queryLocal` + `setLocalCorpus`.
- Modul 03 (Embedding) ist im Endknoten geladen (Karte 09 §
  Schritt 5).
- Modul 15 Sub (b) postMessage-Bridge ist im Endknoten geladen
  (Karte 09 § Schritt 10, BroadcastChannel `sbkim-membrane`).
- Mein-Rezeptbuch hat ein bestehendes Such-Feld in der Navleiste
  (Stand 2026-05-26 — Klaus prüft, ob es da ist und wie es heute
  filtert).

**Branch-Vorschlag (im Endknoten-Repo):** `claude/suchfeld-dual-modus`

---

## Brief-Codeblock (für den ersten Prompt der Bau-Sitzung im Endknoten-Repo)

```
Du bist eine Bau-Sitzung in Mein-Rezeptbuch (externes Endknoten-Repo,
NICHT Sage-Protokol).

Sitzungs-Rolle: Bau-Sitzung Such-Feld-Dual-Modus — bidirektionales
Cross-Knoten-Matching-Anker. Stichwort-Modus (lokaler Substring-
Filter) + Semantik-Modus (queryLocal + BroadcastChannel-postMessage
op:"query" an Mein-Mixarium).

Branch: claude/suchfeld-dual-modus (vom main aus anlegen).

Pflichtleseliste (in dieser Reihenfolge):
1. CLAUDE.md des Endknoten-Repos (sofern vorhanden).
2. Eigene index.html — finde das bestehende Such-Feld.
3. Sage-Protokol docs/components/18_tool_pwa.md § Such-Feld-
   Integration-Pattern (insbesondere § Dual-Modus-Klassifikation
   + § Such-Helper + § Sender-Helper-Code-Pattern + § UI-Pattern
   + § Anker-Pfad + § Edge-Cases). Im Endknoten via WebFetch oder
   sage-Repo-Pfad lesen — die Karte ist die Spec-Vorlage.
4. Sage-Protokol src/modules/04_match.js § queryLocal (Schnittstelle:
   queryLocal(text, k?, options?) + setLocalCorpus). Im Endknoten ist
   das die Datei sbkim/04_match.js (Kopie vom Sage-Bau-04.C-Commit).
5. Eigener sbkim/15_membran.js — Sub (b) op:"query"-Empfänger-Kette
   ist gebaut, die Antwort kommt automatisch sobald 04.C da ist.

Deine Aufgabe:

A. **Modul-Datei `sbkim/04_match.js` aktualisieren** (Kopie aus
   Sage-Protokol-Bau-04.C-Commit). Falls noch alte Version 04.A/04.B
   im Endknoten liegt, mit dem neuen Stand ersetzen.

B. **Korpus aufbauen.** Bei jedem App-Boot oder bei jeder Rezept-
   Änderung Modul 03 nutzen, um pro lokalem Rezept einen
   passageVec zu erzeugen (label + anchorId + passageVec). Der
   anchorId-Wert ist der Rezept-Slug (z.B. "muttis-gulasch").
   Korpus über `SbkimMatch.setLocalCorpus(corpusArray)` registrieren
   (einmalig nach Modul-03-Init).

C. **classifySearch-Helper** im Endknoten-Such-Feld-Code einbauen
   (Code-Schnipsel aus Karte 18 § Dual-Modus-Klassifikation
   übernehmen — 3 Signale: Wort-Anzahl ≤ 3, kein Fragezeichen,
   kein Bridge-Word).

D. **runSearch-Helper** einbauen (Code-Schnipsel aus Karte 18 §
   Such-Helper). Stichwort → lokaler Substring-Filter über Rezept-
   Titel + Tags. Semantik → `SbkimMatch.queryLocal(text, 5)` +
   `sendCrossKnotenQuery(text, 5)` parallel.

E. **sendCrossKnotenQuery** einbauen (BroadcastChannel-basiert,
   Code-Schnipsel aus Karte 18). 3 s Timeout pro Geschwister.
   Geschwister aus `sbkim_siblings_<slot>`-Store laden (slot-
   spezifisch — siehe Bau 02.Y / 06.Y).

F. **UI-Pattern** mit zwei Sektionen rendern: "Lokal (Mein-Rezeptbuch)"
   + "Aus dem Mycel (Mixarium)". Im Stichwort-Modus nur die lokale
   Sektion. Cross-Knoten-Treffer als Links zu
   `https://lausiklauskn-png.github.io/Mein-Mixarium/#anchor=<anchorId>`.

G. **Anker-Pfad bei Boot prüfen:** wenn `window.location.hash` mit
   `#anchor=` startet, scrolle auf das passende Rezept (oder
   markiere es). Nur in Mein-Rezeptbuch wichtig — der Hash-Anker
   ist hier der ankommende Cross-Knoten-Treffer.

H. **Tests** im Endknoten (Browser-Sichttest, Termux-localhost:8000):
   - Eingabe "Gulasch" → Stichwort, lokal-Filter zeigt "Muttis
     Gulasch", KEIN Mycel-Block.
   - Eingabe "welcher Wein passt zu Lasagne?" → Semantik, queryLocal
     liefert leere/wenige lokale Treffer, sendCrossKnotenQuery an
     Mixarium liefert Wein-Empfehlungen.
   - Eingabe "" (leer) → Klassifikation "leer", keine Treffer.
   - Mixarium offline → 3 s Timeout, leere Mycel-Sektion.

I. **Konsole-Hinweise:** classifySearch-Modus + queryLocal-Resultat-
   Anzahl bei jeder Suche `console.info`-loggen (debugging-Anker,
   keine PII).

Was du nicht tust:

- KEIN Modul-04-Code-Eingriff in sbkim/04_match.js (nur Datei-Kopie
  vom Sage-Bau-04.C). Modul 04 ist Spec-Hub-Eigentum, nicht
  Endknoten-Pflege.
- KEIN Modul-15-Eingriff (Sub (b)-Empfänger ist gebaut).
- KEIN Auto-Sender beim App-Boot (Empfangsmodus-Prinzip).
- KEINE Sage-Protokol-Pflicht-Lese-Liste — diese Sitzung ist
  Endknoten-only.

Pflicht am Ende:

- sbkim/04_match.js auf Bau-04.C-Stand.
- Korpus-Aufbau + setLocalCorpus-Aufruf.
- classifySearch + runSearch + sendCrossKnotenQuery + UI-Pattern.
- Anker-Pfad-Hook bei Boot.
- Sichttest 4 Punkte durch Klaus (Stichwort / Semantik / leer /
  Timeout).
- Commit + Push auf claude/suchfeld-dual-modus.
- Draft-PR im Endknoten-Repo, Body verweist auf diesen Brief.
- Endknoten-CLAUDE.md aktualisieren (sofern vorhanden).
```

---

## Hintergrund

Klaus' Vision-Klärung 2026-05-26 (siehe Sage-Protokol PULS-Eintrag
„Tafel-Spec-Pflege Mycel-Vision"): das Such-Feld in jeder Endknoten-
PWA ist der **bidirektionale Cross-Knoten-Matching-Anker**. Beispiel:
User tippt in Mein-Rezeptbuch „welcher Wein passt zu Lasagne" →
lokal: kein direkter Treffer in Rezepten → cross-Knoten-Query an
Mein-Mixarium → Wein-Empfehlung kommt zurück.

Modul 04.C (Sage-Protokol Bau 2026-05-26) hat den lokalen Such-
Backend gebaut. Modul 15 Sub (b) (Sage-Protokol Bau 15.B 2026-05-25)
hat den Cross-Knoten-Empfänger gebaut. Diese Bau-Sitzung verdrahtet
beide in Mein-Rezeptbuchs Such-Feld.

## Nach dieser Sitzung

- **Parallel:** Bau-Sitzung in Mein-Mixarium (siehe
  `BRIEF_BAU_ENDKNOTEN_SUCHFELD_MM.md`). Erst wenn beide laufen,
  ist der Cross-Knoten-Test grün.
- **Cross-Knoten-Sichttest:** Klaus tippt in MR, sieht Treffer aus
  MM (und umgekehrt). Live-Beweis der Mycel-Bidirektionalität.
- **Folge-Pflege:** ggf. Debounce-Tuning, UI-Polish, Score-Anzeige.

## Heilige Tafeln dieser Sitzung

- KEIN Modul-04-Code-Eingriff (Datei-Kopie ist Pflicht-Pfad).
- KEIN Modul-15-Eingriff (fail-soft-Pattern greift automatisch).
- KEINE Sage-Protokol-Branche/PR (das ist eine externe Bau-Sitzung).
- KEIN Auto-Sender beim Boot (Empfangsmodus-Prinzip).

---

**Endstand-Codeblock für die übernächste Sitzung** (wenn Mein-
Mixarium-Brief gelaufen ist, kommt Cross-Knoten-Sichttest):

```
Du bist Sichttest-Sitzung für den Cross-Knoten-Such-Test
Mein-Rezeptbuch ↔ Mein-Mixarium.

Voraussetzungen:
- Bau-Sitzung Such-Feld-Dual-Modus in MR ist gemerged.
- Bau-Sitzung Such-Feld-Dual-Modus in MM ist gemerged.
- Beide Endknoten haben sbkim/04_match.js auf Bau-04.C-Stand.
- DeX-Chrome auf Galaxy Tab S6, Termux-localhost:8000-Setup.

Sichttest-Schritte:
1. Beide PWAs in zwei Tabs öffnen (gleiche Chrome-Instanz!).
2. In MR Such-Feld: "Gulasch" → Stichwort, lokal-Treffer "Muttis
   Gulasch" sichtbar.
3. In MR Such-Feld: "welcher Wein passt zu Gulasch?" → Semantik,
   lokal evtl. leer, "Aus dem Mycel"-Block zeigt MM-Treffer.
4. Klick auf MM-Treffer → wechselt in MM-Tab, scrollt auf
   passenden Cocktail.
5. Umgekehrt: in MM "welcher Snack passt zu Margarita?" → MR-Block
   zeigt Knabber-Treffer.
6. Timeout-Test: einen der Tabs schließen, der andere wartet 3 s,
   zeigt leere Mycel-Sektion.
```
