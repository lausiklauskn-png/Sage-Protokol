# Übergabeprotokoll — „Wählen"-UI Folge: Verwandtschafts-Badge im Rendezvous-Raum (Modul 23) + Pinnwand-Befund

- **Datum:** 2026-06-28 (Nacht)
- **Rolle:** Bausitzung
- **Branch:** `claude/waehlen-ui-relatedness-display-xatbi1`
- **Brief:** `docs/sessions/BRIEF_WAEHLEN_UI_FOLGE_PINNWAND_M23.md`
- **Freibrief:** gilt (CLAUDE.md § Freibrief) — additiv, getestet, abgegrenzt.

## Was getan (zwei abgegrenzte Stränge, beide REINE ANZEIGE)

### Strang B — Modul 23 (Rendezvous-Raum) Verwandtschafts-Badge — **gebaut**

Der Zwei-Maß-Schalter aus Bau 04.E (zentrierter Cosinus) jetzt am **zweiten**
Einbau-Ort aus dem Ursprungs-Brief.

- **Modul 23 (`src/modules/23_rendezvous.js`):** neue **pure** Funktion
  `relatednessForCards(cards, ownSpore)` hängt je Karte einen **zentrierten**
  Verwandtschafts-Score (`SbkimMatch.relatedness`, whitened-light) + `isRelated`
  (≥ `RELATEDNESS_MIN` 0.30) an; `discover()` reicht das durch jede Karte.
  Modul 04 ist **optionale** Anzeige-Abhängigkeit (`cfg.match` injizierbar,
  `_meta.hasMatch`); fail-soft ohne Modul 04 / ohne eigenen `domainVector` /
  ohne Karten-`domainVector` → `relatedness: null`. Eingabe wird **nicht**
  mutiert. `relatedness()` `InvalidVectorError`/`ShapeMismatch` pro Karte
  abgefangen.
- **UI (`src/modules/23_rendezvous_ui.js`):** Badge pro Knoten
  („🧬 verwandt 0.72" wenn `isRelated`, sonst „· verbunden …") + Schalter
  **„🧬 nur verwandte"** (Default aus; filtert die Karten-Liste, ohne neu zu
  lesen — `lastCards`-Re-Render). `_meta.relatedOnly`.

**Disziplin gewahrt:**

- **Reine Anzeige** — der Score gatet **nichts**. 0.80-Andock-Riegel (Modul 05
  Handshake / `PROVIDER_MIN_MATCH`) **unberührt** (Regressionsprobe grün:
  Hub↔Endknoten-`match()` bleibt ≥ 0.80). Kern-Module 02/05/05b **unangetastet**;
  Modul 04 nur **gelesen**.
- Byte-1:1-Kopien `sbkim-bundle/modules/23_rendezvous.js` + `…_ui.js`
  nachgezogen (Drift-Guard grün).

### Strang A — Pinnwand — **bewusst KEIN Eingriff (begründet)**

Befund nach Lesen der Pinnwand-Mechanik (`pinnwand/index.html`):

- Die Pinnwand sortiert die Antworten eines Threads **bereits** nach
  **zentriertem** Cosinus (`relevance(qVec,aVec,mean)` → `whiten()`-Abzug = der
  LEHRE-Kern-Fix). Der Schwerpunkt wächst aus einem **seiten-lokalen** Korpus
  (`accumulate`/`meanVec`, ab ≥ 3 Texten).
- Das ist hier **korrekt und besser** als der netzweite `RELATEDNESS_CENTER`:
  die Pinnwand-Texte sind **beliebige Q&A-Antworten**, nicht Domänen-
  Beschreibungen. `RELATEDNESS_CENTER` ist aber genau ein Mittel über 7
  **Knoten-Domänen-Vektoren** — der falsche Schwerpunkt für freien Antworttext.
  Aufdrücken würde den Boden-Abzug **verschlechtern**.
- Der KI-Richter ist dort **schon opt-in** (Anbieter-Dropdown + Schlüssel +
  Knopf, Default aus).
- **Konsequenz:** kein Code-Eingriff (der Brief erlaubt das ausdrücklich —
  „nur anwenden, wenn es dort wirklich besser wird"). Dokumentiert in
  `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand 2026-06-28 Nacht).

## Geänderte/neue Dateien

- `src/modules/23_rendezvous.js` — `relatednessForCards` + `resolveMatch`/`toVec`
  + `cfg.match`/`applyOpts` + `discover()`-Durchreichung + `_meta.hasMatch` +
  Header-/Surface-Doku.
- `src/modules/23_rendezvous_ui.js` — Verwandtschafts-Badge je Karte +
  „🧬 nur verwandte"-Schalter + `_meta.relatedOnly` + Header-Doku.
- `sbkim-bundle/modules/23_rendezvous.js` + `…_ui.js` — byte-1:1-Kopien.
- `tests/smoke_bau23_rendezvous.mjs` — Proben 12–15 (relatednessForCards an
  echten Knoten-Vektoren + fail-soft + discover-Durchreichung + Andock-
  Regression). **55/55** (vorher 40/40).
- `tests/smoke_bau23_rendezvous_ui.mjs` — Badge-Render + Filter-Proben.
  **32/32** (vorher 23/23).
- `docs/INTERFACES.md` §1 Modul 23 (Surface + Karten-Felder + `_meta.hasMatch`
  + UI-Badge/Filter + optionaler Modul-04-Konsum).
- `docs/components/23_rendezvous.md` — neuer § Verwandtschafts-Score + Test-Stand.
- `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` — Stand 2026-06-28 (Nacht):
  Modul-23-Verdrahtung + Pinnwand-Befund.
- `docs/PULS.md` — neuer Tageseintrag.
- `CLAUDE.md` — Modul-23-Statuszeile ergänzt.

## Tests (headless, grün)

- `node tests/smoke_bau23_rendezvous.mjs` → **55/55**
- `node tests/smoke_bau23_rendezvous_ui.mjs` → **32/32**
- `node tests/smoke_bundle_connect.mjs` → 21/21 (Drift-Guard)
- 10 unverwandte Smokes scheitern **nur** an fehlendem npm-Paket
  `fake-indexeddb` im Container (vorbestehend, nicht durch diese Sitzung).

## Was offen / Sichttest

- **Browser-Sichttest wartet auf Klaus:** zwei Geräte am echten Relais, Raum
  lesen → Verwandtschafts-Badge je Knoten sichtbar; „🧬 nur verwandte" filtert.
  Andocken muss weiter exakt wie bisher gaten (0.80).
- `RELATEDNESS_CENTER` weiterhin v1 aus 7 Vektoren (eigener Folge-Schritt
  „größeres Referenz-Korpus", unberührt).

## Nächster sinnvoller Schritt

1. Klaus' Browser-Sichttest des Raum-Badges (nicht headless ersetzbar).
2. Danach Rollout des Badge-UI in die anderen PWAs (Modul 23 + UI werden ohnehin
   byte-1:1 kopiert — der Score erscheint automatisch, sobald Modul 04 geladen ist).
