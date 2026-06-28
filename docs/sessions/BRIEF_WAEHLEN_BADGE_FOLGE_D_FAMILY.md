# Brief — „Wählen"-UI Folge: Strang D (RELATEDNESS_CENTER v2) setzen + family-Badge (C.3)

> **Freibrief gilt** (CLAUDE.md § Freibrief). Vor jedem Urteil/Bau:
> `git fetch origin main` + `git ls-tree -r origin/main` + md5 — NIE aus dem
> Working-Tree schließen (Stale-Checkout-Lehre).

## Stand (nach Folge-Sitzung 2026-06-28, Branch `claude/waehlen-badge-relatedness-v2-bww1q5`)

- **Strang C.1 erledigt:** #483 (Badge Modul 23) + #485 (Mess-Knopf) sind in
  Sage main. Drift-Guard intern grün. Sage main trägt das Badge.
- **Strang C.2 gebaut, wartet auf Klaus:** Draft-PR `Mein-Mixarium#81` —
  `sbkim/{04_match,23_rendezvous,23_rendezvous_ui}.js` byte-1:1 auf Sage-main-
  Stand. md5-Drift-Guard grün, Lade-Reihenfolge bestätigt. **Merge + Browser-
  Sichttest entscheidet Klaus.**
- **Strang C.3 family offen:** family fährt eigenes Raum-UI → Consumer-Refactor.
- **Strang D blockiert:** wartet auf Klaus' Mess-Knopf-Ergebnis (Panel 04).

## Aufgabe dieser Folge-Sitzung (zwei abgegrenzte Stränge)

**Strang D — `RELATEDNESS_CENTER` v2 setzen (NUR mit Klaus' Mess-Ergebnis).**
Klaus klickt den Mess-Knopf (`tests/manual_check.html` Panel 04, „RELATEDNESS_
CENTER v2 messen …"), liest das v2-Literal + die v1/v2-Referenz-Tabelle. Bei
`freigabeReif:true` (Schwestern oben + verwandt, Hub↔Endknoten unten + nicht-
verwandt, in v1 UND v2): Konstante in `src/modules/04_match.js` bewusst auf das
v2-Literal setzen. **Netzweit** → SIGNAL §11.6 Pflicht + ALLE Knoten, die
`04_match.js` fahren, identisch nachziehen (byte-Kopien: `sbkim-bundle/`,
`such-tool/`, Mixarium, family). `smoke_bau04e` muss mit dem neuen Center grün
bleiben (ggf. Erwartungswerte anpassen, dokumentiert). Versions-Hinweis im
Commit/PULS.

**Strang C.3 — family-project-Badge (eigener Scope).** family wird Konsument
von Modul 23 + UI. family fährt KEIN `23_rendezvous_ui.js` — sein Raum-UI ist
eigen. Badge dort = Refactor des family-eigenen UI auf `relatednessForCards`
(reine Anzeige, gatet nichts). Erst Plan an Klaus (Plan-vor-Code), da family-
UI-Architektur betroffen.

## Datenverträge (nicht brechen)
- **Reine Anzeige-Schicht.** `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80, Modul 05 Handshake) bleibt unverändert.
- Vektoren `Float32Array(384)`, L2-normiert (Modul 03). `relatedness` wirft
  `InvalidVectorError` → fail-soft umschließen.
- `RELATEDNESS_CENTER`-Änderung ist netzweit → alle Knoten identische Konstante
  (SIGNAL §11.6, Versions-Hinweis im Commit/PULS).
- Modul 23/05/05b/02 Kern unangetastet; Modul 04 nur bei Strang D an EINER
  Konstante gesetzt.

## Akzeptanzkriterien
1. (D) v2-Konstante nur bei `freigabeReif`, netzweit identisch (alle byte-
   Kopien), SIGNAL gesetzt, `smoke_bau04e` grün, Referenz-Fälle dokumentiert.
2. (C.3) family-Badge nach Plan-Freigabe, reine Anzeige, family-Kern-Logik
   unberührt, Drift-Guard wo zutreffend grün.
3. Headless-Smoke grün; Browser-Sichttest wartet auf Klaus.

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)
1. Dieser Brief. 2. `CLAUDE.md` (Freibrief, Konventionen). 3. `docs/PULS.md`
(oberster Eintrag). 4. `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`. 5.
`INTERFACES.md` §0 (`RELATEDNESS_MIN`) + §1 Modul 04 + Modul 23. 6. Code:
`src/modules/04_match.js` (`RELATEDNESS_CENTER`/`relatedness`),
`tests/manual_check.html` Panel 04 (Mess-Knopf), family-Raum-UI + Script-Tags.

## Abschluss-Pflicht (die Kette reißt nie ab)
PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen
Brief als Codeblock im Chat. SIGNAL §11.6 bei Strang D (netzweite Konstante)
Pflicht. Kern-Match bleibt unberührt.
