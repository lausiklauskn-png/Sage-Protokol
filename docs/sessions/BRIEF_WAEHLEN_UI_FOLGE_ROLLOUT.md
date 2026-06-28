# Brief — „Wählen"-UI Folge: Verwandtschafts-Badge netzweit ausrollen + größeres Referenz-Korpus

> **Freibrief gilt** (CLAUDE.md § Freibrief). Vor jedem Urteil/Bau:
> `git fetch origin main` + `git ls-tree -r origin/main` + md5 — NIE aus dem
> Working-Tree schließen (Stale-Checkout-Lehre).

## Stand (erledigt, nach Merge des Vorgänger-PRs auf `main`)

Der **Verwandtschafts-Badge im Rendezvous-Raum (Modul 23)** ist gebaut
(Brief `BRIEF_WAEHLEN_UI_FOLGE_PINNWAND_M23.md`, Strang B): `discover()` reicht
je Karte einen **zentrierten** Score durch (`relatednessForCards`, Modul 04
`relatedness`/`isRelated`, optionale Anzeige-Abhängigkeit, fail-soft); UI zeigt
Badge („🧬 verwandt 0.72" vs „· verbunden …") + „🧬 nur verwandte"-Schalter
(Default aus). **Reine Anzeige — gatet nichts, 0.80-Andock-Riegel (Modul 05)
unberührt, Kern-Module 02/05/05b unangetastet.** Surface `+relatednessForCards`,
`_meta.hasMatch`; UI `_meta.relatedOnly`. Smoke `smoke_bau23_rendezvous.mjs`
55/55, `smoke_bau23_rendezvous_ui.mjs` 32/32, Drift-Guard byte-1:1 grün.
**Strang A (Pinnwand): bewusst KEIN Eingriff** — zentriert bereits seiten-lokal
(passender als netzweiter `RELATEDNESS_CENTER` für freien Q&A-Text), Richter
schon opt-in. **Browser-Sichttest des Badges wartet auf Klaus.**

## Aufgabe dieser Folge-Sitzung (zwei abgegrenzte, je optionale Stränge)

**Strang C — Badge-UI netzweit ausrollen.** Modul 23 + `23_rendezvous_ui.js`
werden ohnehin byte-1:1 in jede PWA kopiert. Prüfen, welche PWAs den Raum-Knopf
schon fahren (Mixarium, family-project, ggf. Rezeptbuch) und sicherstellen, dass
dort **Modul 04 (`SbkimMatch`) vor Modul 23 geladen** ist — sonst bleibt das
Badge stumm (fail-soft, korrekt, aber unsichtbar). Pro Repo: byte-1:1-Kopie der
beiden Modul-23-Dateien aktualisieren + Lade-Reihenfolge prüfen. **Kein
Funktions-Eingriff** — nur Kopie + Script-Reihenfolge. Drift-Guard pro Repo grün.

**Strang D — `RELATEDNESS_CENTER` v2 aus größerem Referenz-Korpus.** Der
zentrierte Score nutzt aktuell `RELATEDNESS_CENTER` v1 = L2-normierter Mittel
über **nur 7** Knoten-Domänen-Vektoren (LEHRE-Caveat). Additiv durch einen
Mittelwert aus **größerem** Referenz-Korpus ersetzbar, **ohne** Vertrag /
`PROTOCOL_VERSION` zu brechen (Konstante in Modul 04). Verfahren: mehr echte
Domänen-/Inhaltstexte einbetten (Browser, transformers.js), Mittel rechnen,
Konstante setzen, Schwellen-Wirkung an den Referenz-Fällen prüfen (Schwestern
oben, Hub↔Endknoten unten **muss erhalten bleiben**). **Headless nicht messbar**
(Embedding lädt nur im Browser) → Mess-Knopf in `tests/manual_check.html` Panel
04, dann Konstante bewusst setzen. **Nur mit Klaus' OK**, weil netzweite
Konstante (alle Knoten müssen identisch rechnen).

## Datenverträge (nicht brechen)

- **Reine Anzeige-Schicht.** `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80, Modul 05 Handshake) bleibt unverändert.
- Vektoren `Float32Array(384)`, L2-normiert (Modul 03). `relatedness` wirft
  `InvalidVectorError` bei falscher Eingabe → fail-soft umschließen.
- `RELATEDNESS_CENTER`-Änderung ist netzweit → alle Knoten müssen dieselbe
  Konstante fahren (SIGNAL §11.6 ankündigen, Versions-Hinweis).
- Modul 23/05/05b/02 Kern unangetastet; Modul 04 wird nur gelesen (Strang C)
  bzw. die Konstante bewusst gesetzt (Strang D).

## Akzeptanzkriterien

1. (C) Jede Raum-fahrende PWA: Modul-23-Dateien byte-1:1 aktuell + Modul 04 vor
   Modul 23 geladen → Badge erscheint live. Drift-Guard grün.
2. (D) `RELATEDNESS_CENTER` v2 an Referenz-Fällen nachprüfbar (Schwestern oben,
   Hub↔Endknoten unten), Andock-Verhalten unverändert (0.80).
3. Headless-Smoke grün; netzweite Konstanten-Änderung dokumentiert + SIGNAL.
4. **Browser-Sichttest** wartet auf Klaus.

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)

1. Dieser Brief. 2. `CLAUDE.md` (Freibrief, Konventionen). 3. `docs/PULS.md`
(oberster Eintrag). 4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md` (Stand
2026-06-28 Nacht + Fix-Konzept Stufe 2). 5. `INTERFACES.md` §0
(`RELATEDNESS_MIN`) + §1 Modul 04 + Modul 23. 6. Code: `src/modules/04_match.js`
(`RELATEDNESS_CENTER`/`relatedness`) + `src/modules/23_rendezvous.js`
(`relatednessForCards`) + `src/modules/23_rendezvous_ui.js` (Badge/Filter) +
(Strang C) die Ziel-PWA-`index.html`-Script-Reihenfolge.

## Abschluss-Pflicht (die Kette reißt nie ab)

PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen
Brief als Codeblock im Chat. SIGNAL §11.6 bei Strang D (netzweite Konstante)
Pflicht; Strang C (reine Kopie) i.d.R. nicht. Kern-Match bleibt unberührt.
