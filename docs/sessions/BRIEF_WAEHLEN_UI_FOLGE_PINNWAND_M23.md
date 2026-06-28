# Brief — „Wählen"-UI Folge: Pinnwand + Modul-23-Raum auf zwei Maße heben

> **Freibrief gilt** (CLAUDE.md § Freibrief). Vor jedem Urteil/Bau:
> `git fetch origin main` + `git ls-tree -r origin/main` + md5 — NIE aus dem
> Working-Tree schließen (Stale-Checkout-Lehre).

## Stand (erledigt, auf `claude/brief-ui-selection-neh6gx` / nach Merge auf `main`)

Der **Umschalter „verbunden" (grob) ↔ „verwandt" (genau)** ist im **Such-Widget
(Modul 22)** gebaut (Brief `BRIEF_WAEHLEN_UI_GROB_GENAU.md`): reine Anzeige-Schicht,
`relatedness()` gatet nichts, Andock-Handshake (0.80) unberührt, Modul 04 nicht
angefasst. Surface `setViewMode/getViewMode/setRelatedOnly/rankView`,
`_meta.viewMode/relatedOnly/hasQueryVec`, Persistenz `sbkim_search_widget_view`,
Smoke `tests/smoke_bau22e_waehlen.mjs` 27/27. **Browser-Sichttest wartet auf Klaus.**

## Aufgabe dieser Folge-Sitzung (zwei abgegrenzte, je optionale Stränge)

**Strang A — Pinnwand auf den Zwei-Maß-Schalter heben.** Befund der Vorsitzung:
die Pinnwand sortiert ebenfalls „nach Bedeutung" (`embedQuery`/`embedPassage` +
`.a-score`-Cosinus + optionaler `.a-judge`-Richter). Prüfen + ggf. anwenden:
- `.a-score` von rohem auf **zentrierten** Cosinus heben (Modul 04 `relatedness()`),
  ODER beide Werte zeigen (roh als Andock-Boden, zentriert als ehrlicher Bezug).
- Richter dort ebenfalls **opt-in** statt automatisch, falls noch nicht.
- **Nur anwenden, wenn es dort wirklich besser wird** — erst Pinnwand-Mechanik
  (Nostr-Q&A-Brett) lesen, dann entscheiden (kein Zwang).

**Strang B — Modul-23-UI (Rendezvous-Raum) Verwandtschafts-Badge.** Pro Knoten im
Raum den **zentrierten** Verwandtschafts-Score als Badge zeigen (z. B. „verwandt
0.72" vs nur „verbunden"), optional „nur verwandte zeigen"-Haken — der zweite
Einbau-Ort aus dem Ursprungs-Brief. **Reine Anzeige** — der 0.80-Andock-Riegel
(Modul 05) bleibt unberührt.

## Datenverträge (nicht brechen)

- **Reine Anzeige-Schicht.** `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80, Modul 05 Handshake) bleibt unverändert. Nur Darstellung sortieren/filtern.
- Vektoren `Float32Array(384)`, L2-normiert (Modul 03). `relatedness` wirft
  `InvalidVectorError` bei falscher Eingabe → fail-soft umschließen.
- Default „verbunden"/grob; „verwandt" ist die bewusste Wahl.
- `MEAN_VECTOR` (`RELATEDNESS_CENTER`) ist v1 aus 7 Vektoren — **nicht** neu rechnen
  (eigener Folge-Schritt „größeres Referenz-Korpus").

## Akzeptanzkriterien

1. (A) Pinnwand: zentrierter Bezug sichtbar ODER begründet, warum nicht angewandt.
2. (B) Modul-23-Raum: Verwandtschafts-Badge pro Knoten, an Referenz-Vektoren
   nachprüfbar (Schwestern oben, Hub↔Endknoten unten).
3. Headless-Smoke der neuen Anzeige-Logik grün (reine Funktion testbar).
4. Andock-Verhalten unverändert (Handshake gatet weiter 0.80).
5. Tafeln nachgezogen (Karte 22/23 bzw. Pinnwand-Doku, PULS, INTERFACES).
6. **Browser-Sichttest** wartet auf Klaus.

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)

1. Dieser Brief. 2. `CLAUDE.md` (Freibrief, Konventionen). 3. `docs/PULS.md`
(oberster Eintrag: „Wählen"-UI). 4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`.
5. `INTERFACES.md` §0 (`RELATEDNESS_MIN`) + §1 Modul 04 + Modul 22 (Surface
`rankView`/`setViewMode`). 6. Code des Ziel-Moduls (Pinnwand-Quelle ODER
`sbkim/23_rendezvous_ui.js`) + `src/modules/04_match.js` (`relatedness`/`isRelated`)
+ `src/modules/22_such_widget.js` (`rankView` als Vorlage).

## Abschluss-Pflicht (die Kette reißt nie ab)

PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen
Brief als Codeblock im Chat. SIGNAL §11.6 nur falls netz-relevant (reine Anzeige
ist es i.d.R. nicht). Kern-Match bleibt unberührt — diese Sitzung ist **reine
Anzeige**.
