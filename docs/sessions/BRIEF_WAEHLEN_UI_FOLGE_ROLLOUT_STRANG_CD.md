# Brief — „Wählen"-UI Folge: Badge-Rollout (C) abschließen + RELATEDNESS_CENTER v2 setzen (D)

> **Freibrief gilt** (CLAUDE.md § Freibrief). Vor jedem Urteil/Bau:
> `git fetch origin main` + `git ls-tree -r origin/main` + md5 — NIE aus dem
> Working-Tree schließen (Stale-Checkout-Lehre).

## Stand (nach Sitzung 2026-06-28 Nacht, Branch `claude/relatedness-badge-rollout-84fg17`)

Zwei Befunde + ein gebauter Mess-Knopf:

1. **Vorgänger-PR #483 (Strang-B-Badge in Modul 23) ist NICHT gemerged** —
   offener Draft `claude/waehlen-ui-relatedness-display-xatbi1`. `relatednessForCards`
   + Badge-UI leben nur dort (Sage-main `smoke_bau23` = 40, nicht 55).
2. **Strang C blockiert auf #483.** Sage-main Modul-23-Dateien sind bereits
   byte-identisch mit Mixariums Kopien; der echte Rollout-Bedarf ist Mixariums
   **driftendes `sbkim/04_match.js`** (alte Version OHNE `relatedness`). Lade-
   Reihenfolge (04 vor 23) ist überall schon korrekt. Nicht live gerollt, weil
   das unverifiziertes Badge-UI in die deployte Mixarium-PWA schöbe.
3. **Strang D Mess-Knopf gebaut** (`tests/manual_check.html` Panel 04,
   „RELATEDNESS_CENTER v2 messen …") — gibt v2-Literal + v1/v2-Referenz-Tabelle
   aus, **ändert KEINE Konstante**. Wartet auf Klaus' Browser-Mess-Lauf.

## Aufgabe dieser Folge-Sitzung (drei abgegrenzte, je optionale Stränge)

**Strang C.1 — #483 einsortieren.** Prüfe #483 (headless-grün, reine Anzeige,
gatet nichts, 0.80-Riegel unberührt). Entweder mergen (Freibrief: getestet +
abgegrenzt) ODER Klaus testet das Badge zuerst in der Sage-Page — sein Zuruf
entscheidet. **Erst danach** hat Sage main das Badge.

**Strang C.2 — Mixarium-Rollout (NACH C.1).** In `Mein-Mixarium` byte-1:1 auf
Sage-main-Stand ziehen: `sbkim/04_match.js` (behebt den Drift — bringt
`relatedness`/`RELATEDNESS_CENTER`), `sbkim/23_rendezvous.js`,
`sbkim/23_rendezvous_ui.js`. Lade-Reihenfolge ist schon korrekt (04 vor 23).
md5-Drift-Guard gegen Sage main grün. **Kein Funktions-Eingriff.** Mixarium-QC
↔ index-Synchronität beachten (Mixarium-CLAUDE.md: `index.html` = Spiegel) —
**aber** die `sbkim/`-Module liegen außerhalb der QC/index-Spiegelung, nur die
Script-Tags zählen. Browser-Sichttest (Badge je Knoten im Raum) wartet auf Klaus.

**Strang C.3 — family-project (optional, eigener Scope).** family fährt sein
eigenes Raum-UI (kein `23_rendezvous_ui.js`). Badge dort = Consumer-Refactor
(family wird Konsument von Modul 23+UI). Eigener Brief, nicht mit C.2 mischen.

**Strang D — `RELATEDNESS_CENTER` v2 setzen (NUR mit Klaus' Mess-Ergebnis).**
Klaus klickt den Mess-Knopf (Panel 04), liest das v2-Literal + die Referenz-
Tabelle. Bei `freigabeReif:true` (Schwestern oben + verwandt, Hub↔Endknoten
unten + nicht-verwandt, in v1 UND v2): Konstante in `src/modules/04_match.js`
bewusst auf das v2-Literal setzen. **Netzweit** → SIGNAL §11.6 Pflicht +
ALLE Knoten, die `04_match.js` fahren, identisch nachziehen (byte-Kopien:
`sbkim-bundle/`, `such-tool/`, Mixarium, family). `smoke_bau04e` muss mit dem
neuen Center grün bleiben (ggf. Erwartungswerte anpassen, dokumentiert).

## Datenverträge (nicht brechen)

- **Reine Anzeige-Schicht.** `relatedness()` gatet nichts; `PROVIDER_MIN_MATCH`
  (0.80, Modul 05 Handshake) bleibt unverändert.
- Vektoren `Float32Array(384)`, L2-normiert (Modul 03). `relatedness` wirft
  `InvalidVectorError` → fail-soft umschließen.
- `RELATEDNESS_CENTER`-Änderung ist netzweit → alle Knoten identische Konstante
  (SIGNAL §11.6, Versions-Hinweis im Commit/PULS).
- Modul 23/05/05b/02 Kern unangetastet; Modul 04 wird bei Strang D bewusst an
  EINER Konstante gesetzt, sonst nur gelesen.

## Akzeptanzkriterien

1. (C.1) #483 ist in Sage main ODER explizit „wartet auf Klaus' Browser-Test".
2. (C.2) Mixarium: `04_match.js` + beide Modul-23-Dateien byte-1:1 zu Sage main,
   Drift-Guard grün, Lade-Reihenfolge bestätigt. Badge erscheint live (Klaus).
3. (D) v2-Konstante nur bei `freigabeReif`, netzweit identisch, SIGNAL gesetzt,
   `smoke_bau04e` grün, Referenz-Fälle dokumentiert.
4. Headless-Smoke grün; Browser-Sichttest wartet auf Klaus.

## Pflichtlektüre VOR der Arbeit (in dieser Reihenfolge)

1. Dieser Brief. 2. `CLAUDE.md` (Freibrief, Konventionen). 3. `docs/PULS.md`
(oberster Eintrag — Sitzung 2026-06-28 Nacht). 4.
`docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`. 5. `INTERFACES.md` §0
(`RELATEDNESS_MIN`) + §1 Modul 04 + Modul 23. 6. Code:
`src/modules/04_match.js` (`RELATEDNESS_CENTER`/`relatedness`),
`tests/manual_check.html` Panel 04 (der Mess-Knopf), die Ziel-PWA-`sbkim/`-
Dateien + Script-Reihenfolge.

## Abschluss-Pflicht (die Kette reißt nie ab)

PULS fortschreiben, Übergabeprotokoll, „Nächste Schritte"-Block im Chat, neuen
Brief als Codeblock im Chat. SIGNAL §11.6 bei Strang D (netzweite Konstante)
Pflicht. Kern-Match bleibt unberührt.
