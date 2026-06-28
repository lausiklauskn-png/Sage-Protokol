# Übergabeprotokoll — „Wählen"-UI Folge: Strang D Mess-Knopf + Strang C blockiert

- **Datum:** 2026-06-28 (Nacht)
- **Rolle:** Pflege/Bausitzung
- **Branch:** `claude/relatedness-badge-rollout-84fg17`
- **Brief:** „Wählen"-UI Folge — Verwandtschafts-Badge netzweit ausrollen (C)
  + größeres Referenz-Korpus für `RELATEDNESS_CENTER` v2 (D)
- **Freibrief:** gilt (CLAUDE.md § Freibrief) — additiv, getestet, abgegrenzt.

## Befund vorab (Stale-Checkout-Lehre befolgt)

Gegen `origin/main` geprüft (`git fetch` + `git ls-tree` + md5), **nicht** aus
dem Working-Tree geschlossen.

**Der Brief nimmt an, der Vorgänger-PR #483 (Strang-B-Badge in Modul 23) sei
„nach Merge auf main" — er ist NICHT gemerged.** Offener Draft auf
`claude/waehlen-ui-relatedness-display-xatbi1`. Belege:

- `git grep relatednessForCards origin/main` → leer.
- `smoke_bau23_rendezvous.mjs` auf main = **40** Proben (auf PR-#483-Branch 55).
- md5 `src/modules/23_rendezvous*.js`: main ≠ PR #483 (Badge-Code), `04_match.js`
  main == PR #483 (unverändert).

Klaus per `AskUserQuestion` zur Sequenz (PR #483 mergen vs. erst Browser-Test)
und zu Strang D gefragt → **„keine Präferenz"** beidemal → Urteil unter
Freibrief.

## Strang C — als blockiert dokumentiert, NICHT live gerollt

- **Sage-main Modul-23-Dateien sind bereits byte-identisch mit Mixariums
  Kopien** (md5 `23_rendezvous.js` + `23_rendezvous_ui.js` identisch) → eine
  Kopie heute ändert nichts; das Badge erscheint erst, wenn #483 in Sage main
  ist.
- **Eigentliche Lücke:** Mixariums `sbkim/04_match.js` **driftet** gegen Sage
  main (alte Version OHNE `relatedness()`/`RELATEDNESS_CENTER`, md5 ≠). Selbst
  mit Badge-Code bliebe das Badge in Mixarium **stumm** (fail-soft korrekt,
  aber unsichtbar), bis dieses Modul nachgezogen wird — das ist der echte
  Strang-C-Kern, nicht die Lade-Reihenfolge.
- **Lade-Reihenfolge ist überall schon korrekt** (Modul 04 vor Modul 23):
  Mixarium `index.html` (04 Z.13077 < 23 Z.13087); family-project
  `index.html` (04 Z.121 < 23 Z.129) + `netzwerk.html` (04 Z.116 < 23 Z.125).
- family-project fährt sein **eigenes** Raum-UI (kein `23_rendezvous_ui.js`) →
  Badge dort = Teil des Consumer-Refactors (eigener Folge-Schritt, nicht dieser
  Brief). Rezeptbuch fährt den Raum noch gar nicht. Keine offenen PRs in
  Mixarium/family.
- **Entscheidung (Freibrief-Grenze: outward-facing, schwer zu „un-sehen"):**
  kein Live-Push unverifizierten Badge-UI in die deployte Mixarium-PWA vor
  Klaus' Browser-Sichttest. Remediation ist mechanisch, sobald #483 in main:
  Mixarium `04_match.js` + beide Modul-23-Dateien auf Sage-main-Stand,
  Drift-Guard grün, eigener Rollout-PR.

## Strang D — Mess-Knopf gebaut, Konstante NICHT geändert

`tests/manual_check.html` Panel 04, neuer Knopf **„RELATEDNESS_CENTER v2 messen
(größeres Korpus → Literal + Referenz-Fälle)"**:

- Bettet einen **breiten, diversen 32-Text-Korpus** ein (5 SBKIM-Knoten-Domänen
  + 27 quer gestreute Allgemein-Texte), via Modul 03 `embedPassageBatch`;
  L2-normiert je Vektor, mittelt, re-normiert → **v2-Kandidat**.
- Gibt das **kopierfertige Float32Array-Literal** (48 Zeilen × 8 = 384 Zahlen,
  6 Nachkommastellen, im exakten Stil von `04_match.js`) ins `<pre>` aus
  (echte Newlines via `SbkimUI.log`, weil der JSON-Renderer `\n` escapen würde).
- Baut Referenz-Knoten-Domänenvektoren (Sage/BLP/Rezeptbuch/Mixarium/Tresor via
  `embedContentVector`) und zeigt eine **Referenz-Fall-Tabelle** unter v1
  (eingebauter Center, `SbkimMatch.relatedness`) UND v2 (inline, gleiche
  Mathematik, neuer Center) nebeneinander: Schwestern Rezeptbuch↔Mixarium,
  Hub↔Endknoten Sage↔BLP, Sage↔Rezeptbuch, Tresor↔BLP.
- **Freigabe-Flag** `freigabeReif`: true nur wenn Schwestern verwandt UND über
  Hub↔Endknoten in BEIDEN Maßen, und Hub↔Endknoten unter v2 NICHT verwandt.

**Disziplin:** reine Messung — **ÄNDERT KEINE Konstante**, kein Vertrag /
`PROTOCOL_VERSION` berührt, Modul 04 nur gelesen, Kern 23/05/05b/02 unangetastet,
kein PII (RAM-only). Die netzweite Konstante setzt erst eine bewusste
Folge-Entscheidung mit Klaus' Mess-Ergebnis (SIGNAL §11.6).

## Verifikation

- Headless-Smoke unverändert grün (nur `manual_check.html` angefasst, kein
  Modul-Code): `smoke_bau04a` 19/19, `04b` 30/30, `04c` 43/43, `04d` 68/68,
  `04e` 29/29, `smoke_bau23_rendezvous` 40/40 — alle 0 rot.
- Eingefügter Button-JS: `node --check` grün; Logik headless mit
  deterministischen Stub-Vektoren strukturell geprüft (Literal 48 Zeilen / 384
  Zahlen, Tabelle 4 Zeilen mit `paar/v1/v1_verwandt/v2/v2_verwandt`,
  Ordnungs-Objekt mit `freigabeReif`).
- **NICHT geprüft:** Browser-Sichttest (echte Embeddings, v2-Literal +
  Referenz-Fall-Werte) — wartet auf Klaus' Galaxy-Tab-S6-Lauf.

## Nächster sinnvoller Schritt

1. Klaus klickt den Mess-Knopf → liest v2-Literal + Referenz-Tabelle; bei
   `freigabeReif:true` Konstante bewusst netzweit setzen (eigener Pflege-PR +
   SIGNAL §11.6, dann ALLE Knoten identisch nachziehen).
2. #483 mergen (oder Klaus testet Badge zuerst in Sage), DANACH Strang-C-Rollout
   (Mixarium `04_match` + Modul-23-Dateien byte-1:1, Drift-Guard).
3. Browser-Sichttest beider Stränge wartet auf Klaus.
