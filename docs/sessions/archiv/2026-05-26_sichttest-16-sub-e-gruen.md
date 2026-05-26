# Übergabeprotokoll — Sichttest 16 Sub (e) grün (4/4)

**Datum:** 2026-05-26
**Sitzungs-Rolle:** Pflege-Sitzung Sichttest-Nachzug
**Branch:** `claude/sichttest-16-sub-e-v25wR`
**Vorgänger-PR:** #180 (Bau 16 Sub (e) Bronze/Gold-SIEGEL-Stufung,
gemerged 2026-05-26 als `ffd787a`)

---

## Anlass

Klaus hat unmittelbar nach Merge von PR #180 die vier neuen Panel-16-
Knöpfe 9–12 auf seinem Galaxy Tab S6 (DeX-Chrome, Termux-`python3 -m
http.server 8000`-Setup, Browser-Hard-Reload nach Code-Pull)
durchgeklickt. Alle vier Knöpfe live grün. Diese Pflege-Sitzung zieht
den Befund in Karte 16 + INTERFACES.md + status.json + PULS nach und
schließt damit Pipeline-Phase-A-Schritt 5g (Bau Modul 16 Sub (e)
Bronze/Gold) auf der Sichttest-Achse.

---

## Sichttest-Befunde (4/4 grün)

**Setup:** Klaus, DeX-Chrome auf Galaxy Tab S6, Termux-
`python3 -m http.server 8000`, Browser-Hard-Reload nach Code-Pull.

### Test 9 — Sub (e) Bronze-Initial (data-stufe + aria-label)

| Feld | Wert |
|---|---|
| `badge_data_stufe` | `"bronze"` |
| `badge_aria_label` | `"SBKIM-Siegel · Mycel suchend"` |
| `badge_title_attribut` | `null` |
| `mycel_connected` | `false` |
| `mycel_connected_at` | `null` |
| `siegel_stufe_getter` | `"bronze"` |

Status-Chip: „Sub (e) Bronze-Initial OK". Disziplin-Belege:
`title:null` bestätigt die Pflege-17-Klausel (keine Doppel-Tooltips
mehr — aria-label trägt den vollen Text); `siegel_stufe_getter`
liefert direkt `"bronze"` ohne Re-Check.

### Test 10 — Bronze→Gold via synthetischem Handshake

Klaus hat den Knopf **zweimal** geklickt — beide Läufe grün dank
`_resetMycelConnectedForTest()`-Test-Brücke, die vor jedem Test den
Bronze-Vorzustand idempotent wiederherstellt.

| Feld | Wert |
|---|---|
| `stufe_vor` | `"bronze"` → `stufe_nach` `"gold"` |
| `aria_label_nach` | `"SBKIM-Siegel · Mycel verbunden"` |
| `mycel_connected_nach` | `true` |
| `mycel_connected_at_nach` | `"2026-05-26T16:27:22.973Z"` |
| `klasse_stufenwechsel_gold` | `true` (direkt nach Dispatch live beobachtet, 600 ms Auto-Remove) |

Status-Chip: „Sub (e) Bronze→Gold OK". Disziplin-Belege:
mycelConnectedAt ist ISO-8601-String (RAM-only, Tab-Reload startet
wieder Bronze — gewollt); Klasse `stufenwechsel-gold` ist direkt nach
Dispatch sichtbar (Animation läuft 600 ms via `@keyframes
siegel-stufenwechsel-gold`).

### Test 11 — Idempotenz (zweiter Handshake ändert nichts)

| Feld | Wert |
|---|---|
| `mycel_connected_at_erste_welle` | `"2026-05-26T16:27:56.565Z"` |
| `mycel_connected_at_zweite_welle` | `"2026-05-26T16:27:56.565Z"` |
| `datum_unveraendert` | `true` |
| `klasse_vor_zweitem_dispatch` | `false` (nach 750 ms Wartezeit) |
| `klasse_nach_zweitem_dispatch` | `false` |
| `stufe_nach_zweitem_dispatch` | `"gold"` |

Status-Chip: „Idempotent OK". Disziplin-Belege:
`onHandshakeEvent()`-Handler bricht beim zweiten Dispatch früh ab
via `if (mycelConnected) return;` — keine zweite Animation, keine
neue Timestamp.

### Test 12 — Bronze-Klick öffnet Modal mit Hinweis-Block + [Andocken]

| Feld | Wert |
|---|---|
| `modal_offen` | `true` |
| `hinweis_block_im_dom` | `true` |
| `hinweis_block_sichtbar` | `true` |
| `andock_button_im_modal` | `true` |
| `aspekt_4_pending_marker` | `true` |
| `letzter_aspekt_text_kopf` | `"pending· 16· Mycel-Verbindung etabliert (erster Handshake)…"` |
| `aspekte_anzahl` | `4` |

Status-Chip: „Bronze-Klick OK". Disziplin-Belege:
`renderBronzeHinweisBlock()` setzt display:block in Bronze + zeigt
[Andocken]-Knopf; `isAspect4()`-Pending-Marker rendert in Bronze
„pending" statt Datum; Aspekt-Anzahl 4 belegt, dass Aspekt 4
(Mycel-Verbindung etabliert) am Listen-Ende sitzt.

---

## Was diese Pflege-Sitzung getan hat

1. **Karte 16 § Bauzustand** — „Sichttest Sub (e) — folgt"-Zeile
   durch volle 4/4-grün-Sichttest-Zeile mit allen Knopf-Outputs
   ersetzt. Die alte „Sichttest 16 — folgt"-Zeile (Basis-Sichttest
   Knöpfe 1–8) bleibt unverändert.
2. **INTERFACES.md § 1 Modul 16 Geprüft-Zeile** um vierten Eintrag
   „2026-05-26 (Sichttest Bau 16 Sub (e) — Klaus, DeX-Chrome auf
   Galaxy Tab S6: Panel 16 Knöpfe 9–12 4/4 grün)" erweitert. Status-
   Zeile bleibt `entwurf` (Bau-16-Basis-Sichttest noch offen).
3. **INTERFACES.md § 10 Änderungsprotokoll** neue Tabellen-Zeile
   „Sichttest 16 Sub (e) grün" mit vollem Bericht.
4. **`status.json` Modul 16** `siegel`-Text um Sub-(e)-Sichttest-
   Befund erweitert (alle vier Knopf-Outputs wortwörtlich + „Sichttest
   Knöpfe 1–8 (Bau-16-Basis) bleibt ungeprüft"-Marker). **Score
   BLEIBT `"stub"`** — Sub-(e)-Sichttest deckt nur Knöpfe 9–12 ab.
5. **`update_puls_pie.py`** aufgerufen → Pie unverändert
   (kein Score-Wechsel, kein Pool-Wechsel).
6. **PULS.md** § Schnellüberblick Modul-16-Zeile aktualisiert
   (Spec-Spalte + Code-Spalte + Sichttest-Spalte); neuer Sitzungs-
   Eintrag oben.
7. **Übergabeprotokoll** (diese Datei) angelegt.

---

## Was diese Pflege NICHT getan hat

- KEIN Modul-Code-Eingriff in `src/modules/16_siegel.js`.
- KEIN Eingriff in andere Module (00/01/02/03/04/05/06/07/08/15/17/18/19).
- KEINE Endknoten-Sitzung (externe Repos unangetastet).
- KEIN PROTOCOL_VERSION-/DB_VERSION-/BACKUP_FORMAT_VERSION-Bump.
- KEIN Score-Wechsel in `status.json` Modul 16 — bleibt `"stub"`,
  weil Bau-16-Basis-Sichttest (Knöpfe 1–8) noch offen ist.
- KEIN neuer ZERTIFIKAT_ASPEKTE-Eintrag (Sichttest-Nachzug ist keine
  Sicherheits-Modul-Pflege, die CLAUDE.md § „Sicherheits-Module
  pflegen Aspekte"-Konvention greift nicht).
- KEINE Tafel-Umsortierung CLAUDE.md.
- KEIN neuer Brief.

---

## Heilige Tafeln respektiert

- Score-Wechsel-Konvention 04.B/04.C analog: bei Teil-Sichttest
  bleibt der Score auf `"stub"` mit Sichttest-Anker im Text;
  erst nach Voll-Sichttest darf auf `"fertig"` gewechselt werden.
- Sichttest-Befund kommt in **alle drei** Doku-Ankerpunkte (Karte +
  INTERFACES.md + status.json + PULS), nicht nur PULS.
- Pflege-Sitzung läuft als eigener PR (nicht in den Bau-PR
  zurückgemerged) — Übersichts-Disziplin.

---

## Was offen blieb

- **Sichttest Bau-16-Basis (Knöpfe 1–8)** weiterhin ungeprüft.
  Eigener Sichttest-Nachzug nötig (Setup + Test 1 PFLICHT_MODULE-
  Spec + Test 2 Snapshot-Schema + Test 3 Badge im DOM + Modal +
  Test 4 Modal-Render + Test 5 repoUrl-Auto-Erkennung + Test 6
  First-Boot-Flag + Test 7/8 Hinweis-Knöpfe). Erst wenn Voll-
  Sichttest grün ist, kann Modul 16 Score auf `"fertig"`
  wechseln (analog Konvention 04.B/04.C).
- **Endknoten-Re-Aktivierung Modul 15+16+04.C** in Mein-Rezeptbuch
  + Mein-Mixarium (Pipeline-Phase A Schritt 5e). Setzt aktuellen
  Stand voraus — Sub (e) Sichttest grün stellt sicher, dass die
  Endknoten beim ersten Cross-Knoten-Handshake live Bronze→Gold
  wechseln werden.

---

## Nächster sinnvoller Schritt

1. **Endknoten-Re-Aktivierung Mein-Rezeptbuch + Mein-Mixarium**
   (Pipeline-Schritt 5e, eigene Folge-Sitzung pro Endknoten-Repo).
   Setzt PR #180-Merge (erledigt) + dieses Sichttest-Befund-PR
   voraus — der live Bronze→Gold-Wechsel ist bewiesen, die
   Endknoten dürfen den neuen Modul-16-Code übernehmen.
2. **Sichttest Bau-16-Basis Knöpfe 1–8** — Klaus, Panel 16 Setup +
   Tests 1–8 in DeX-Chrome (nicht headless ersetzbar). Sobald 8/8
   grün ist, eigene Sichttest-Nachzug-Pflege „Sichttest 16 Basis
   grün" mit Score-Wechsel `"stub"` → `"fertig"`.
3. **Spec/Bau Modul 18 Tool-PWA-Container** (Pipeline-Schritt 5h)
   — entfernt die `[Andocken]`-Knopf-Info-Notiz aus Modul 16
   Sub-(e)-Modal-Bronze-Hinweis-Block (fail-soft-Check ruft dann
   `window.SbkimToolPwa.openAndockTab()` produktiv).

---

## PR-Konvention

Branch `claude/sichttest-16-sub-e-v25wR`, Draft-PR folgt unmittelbar
nach Commit + Push. Klaus zieht ihn ready+merge via „PR mergen"-
Zuruf.
