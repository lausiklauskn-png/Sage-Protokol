# Übergabeprotokoll — Sichttest-Folge zur Bau-Sitzung Sage-Page-Refactor

**Datum:** 2026-05-21 (Nachmittag/Abend, nach PR #126-Merge)
**Sitzungs-Rolle:** Sichttest-Folge zur Bau-Sitzung Sage-Page-Refactor.
Live-Andock von Sage als drittem Endknoten + Test-Bridge-Pflege-Kaskade
+ kleinere Page-Pflege (Hash-Trigger, Wizard-Footer).
**Branch:** `claude/bau-sage-page-refactor-E7wNI` (Sitzungs-Anker;
einzelne Pflege-PRs auf eigenen Sub-Branches, alle gemerged).
**Voraussetzungen:** PR #126 (Bau Sage-Page-Refactor) gemerged
2026-05-21 mittags. Klaus' Hauptaufgabe in dieser Folge-Sitzung war
der **Browser-Sichttest** auf der echten Sage-Page-URL und die
Schließung aller Stolperer, die den Sichttest blockierten.

---

## Kern (drei Sätze)

Klaus hat den Andock-Wizard auf
`https://lausiklauskn-png.github.io/Sage-Protokol/` live durchgespielt
— alle drei Schritte grün, signed `spore.json` (11,19 KB) + verschlüsseltes
Backup heruntergeladen, `nodeId nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA`
in `sbkim_sage` IndexedDB. Damit ist Sage offiziell der **dritte Endknoten**
neben Rezeptbuch und Mixarium; `NODE_TYPE_DEFAULT = "hybrid"` aus
INTERFACES §0 ist endlich selbstreferenziell wahr. Acht Pflege-PRs
gemerged — von Modul-04-Test-Setup-Fix bis Live-Spore-Commit.

---

## Acht PRs in chronologischer Reihenfolge

| # | Titel | Was |
|---|---|---|
| 127 | Pflege Bau 04.B Test 10 — Setup auf vollständige Vier-Vektor-Probe | Test-Setup-Fix für Modul 04 Test 10 (`explainMatchLLM`) — `matchDimensions(qCap, null, pCap, null)` ist Nur-Anbieter-Fall mit `overall=null`, Bridge braucht beide Vier-Vektor-Sätze. |
| 128 | Pflege manual_check Panel 02 — Knopf „Test-Slots aufräumen (außer main)" | Klaus klickt statt Konsolen-Code (Eruda ist nicht in manual_check.html eingebaut). Entfernt alle slots außer main, fordert zum Hard-Reload auf. |
| 129 | Pflege CLAUDE.md — Betreiber-Arbeitsumgebung | Neuer Sub-Block in CLAUDE.md § „Wer ist der Betreiber": Galaxy Tab S6, DeX-/Tablet-Modus-Split, Termux, Eruda nur wo eingebaut, Sichttest-Stil (Knöpfe statt Konsole), Kommunikations-Stil (Einzelschritte). |
| 130 | Pflege Test-Bridge — slot-suffix nachgezogen (Bau 05.Y / 06.Y / 07.Y) | Test-Bridge auf slot-suffixed Stores nachgezogen — 84 insertions / 39 deletions. Schließt die ROT-Befunde Modul 06 Tests 1/9/10/11, Modul 07 Tests 4/5/6, Modul 00 Test 5 als Test-Bridge-Bug (nicht Modul-Bug). |
| 131 | Pflege manual_check Panel 01 — Notfall-Reset-Knopf für IndexedDB | Direkter `indexedDB.deleteDatabase('sbkim')`-Knopf, umgeht den bekannten Modul-01-Versions-Bump-Bug. Confirm-Dialog, drei Fall-Behandlung (ok / blocked / error). |
| 132 | Pflege Sage-Page — URL-Hash-Trigger `#andock` | `…/Sage-Protokol/#andock` öffnet Wizard auch wenn Identität schon existiert. Klaus konnte sonst nach Erst-Andock nicht zum Wizard zurück (Schwarz-Loch-Karte führt dann zur Observatorium-Doku). |
| 133 | **Sage-Endknoten live** — spore.json signiert + status.json auf live-direct | Sichttest-Beweis-Commit analog 2026-05-16 für Rezeptbuch + Mixarium. `sbkim/spore.json` Placeholder ersetzt durch echte signierte Spore; `status.json § endknoten[sage].integrated: false→true`, `.nodeId: null→"nysOZE3V…YfA"`, `.pingStatus: "pending-first-sichttest"→"live-direct"`. |
| 134 | Pflege Sage-Page — Andock-Wizard-Footer auf Klarheit ohne Insider-Codes | „Variante III, Vision-Anker 2" + „klassischer Pfad" raus; klare Aussage mit einem Link auf Karte 09. Klaus' Feedback im Wizard-Live-Lauf: Insider-Wörter ohne Erklärungs-Brücke. |

Alle PRs Squash-merged, jeweils CI-leer (keine Pipeline auf diesem Repo).

---

## Diagnose-Pfade in dieser Sitzung

### Diagnose 1 — Modul-06/07/00-ROT war Test-Bridge-Bug, nicht Modul-Bug

Klaus' Sichttest-Outputs zeigten bei mehreren Knöpfen rote Status mit
charakteristischen Symptomen: `inbox_hat_eintrag:false`, `anchor_count:1`
statt 5, `eintraege_anzahl:0` statt 3, `vor_forget:0` statt 1,
`stores_alle_leer:false`, `siblings_im_snapshot:0`.

**Code-Review-Befund:** Modul 06 (`src/modules/06_heterokaryose.js`
Zeile 166) baut `sbkim_hetero_inbox_<slot>` (slot-suffixed nach Bau 06.Y).
Modul 07 `confirmSelfApoptose` (Zeilen 561–583) räumt slot-suffixed Stores.
Die **Test-Bridge** in `tests/manual_check.html` greift aber an mehreren
Stellen noch un-suffixed zu — Bridge schreibt in einen Store, Modul liest
aus dem anderen. PR #130 zog die Bridge auf 18+ Stellen nach.

**Modul-Code ist korrekt.** Bau 05.Y / 06.Y / 07.Y / 08.Y waren konsistent
umgesetzt; nur die Test-Brücke war auf dem Pre-Slot-Suffix-Stand
hängengeblieben.

### Diagnose 2 — Bekannter Modul-01-Versions-Bump-Bug bleibt offen

Klaus' Setup-Knopf in Panel 06 warf reproduzierbar
`ensureStore('sbkim_meta') Versions-Bump blockiert — ein anderer Tab haelt
die DB offen und ignoriert onversionchange.`. **Selbst nach Komplett-
Reset der DB** (via PR #131 Notfall-Knopf). Klaus hat alle anderen Tabs zu,
kein Service-Worker für `127.0.0.1:8000` registriert. Der Bug ist
**Browser-spezifisch** (Chrome auf Android-DeX zeigt es stärker als
Desktop-Chrome).

**Code-Pfad:** Modul 01 `init()` ruft `openProbe(name)` (Zeile 484-523),
die eine erste DB-Connection öffnet. Bei Initial-Pfad wird `probedDb.close()`
synchron gerufen (Zeile 376/404), aber IndexedDB schließt Connections
intern asynchron. Spätere `ensureStore`-Bump-Open trifft auf eine noch
nicht vollständig geschlossene Connection → `onblocked`. Modul 01 hat
`onversionchange`-Handler auf der neuen Connection (Zeile 234, 798), aber
**nicht auf der alten openProbe-Connection** — die ist schon „weg" aus
JS-Sicht, lebt aber im IndexedDB-Worker-Thread weiter.

**Folge-Pflege:** eigene Sitzung. Brief noch nicht geschrieben. Modul 01
braucht entweder:
- `onversionchange`-Handler auch auf der Probe-Connection installieren,
- ODER `await new Promise(...)`-Wartemuster nach `probedDb.close()` mit
  `onclose`-Listener, bevor der eigentliche `indexedDB.open(name, version)`
  ausgelöst wird.

Manifestiert sich **nur in `manual_check.html`-Sichttest**, **nicht in
Endknoten-PWAs** (dort gibt es nur einen `init()`-Aufruf pro Tab,
keine späteren `ensureStore`-Bumps in derselben Session).

### Diagnose 3 — Sage-Page Andock-Wizard nur via Erst-Klick

Klaus hatte aus einer früheren Sichttest-Sitzung schon eine Identität in
`sbkim_sage`. `bhStageClick` (`index.html` Zeile 3094-3105) ruft
`openAndockWizard()` nur wenn `sageHasIdentity()` false ist — sonst
öffnet sich die Observatorium-Doku. Kein alternativer Wizard-Zugang.

**PR #132** baute einen URL-Hash-Trigger `#andock` ein. Klaus konnte
danach Spore + Backup nachholen.

---

## Live-Sichttest-Beweis (Andock-Wizard)

Klaus' Browser-Sichttest auf `https://lausiklauskn-png.github.io/Sage-Protokol/#andock`
am Galaxy Tab S6 / DeX-Chrome:

| Schritt | Status | Output |
|---|---|---|
| 1 — Identität erzeugen | ✓ | `nodeId: nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA` (Ed25519 in `sbkim_sage` IndexedDB) |
| 2 — Spore mit Domain-Vektor erzeugen | ✓ | `domainVector.length: 384` (Xenova/multilingual-e5-small), `signature: 86` Zeichen (Ed25519), `spore.json: 11,19 KB` Download |
| 3 — Backup machen | ✓ | passwort-verschlüsseltes Backup-Blob heruntergeladen (PBKDF2-SHA256 600 000 + AES-GCM-256) |

`createdAt: 2026-05-21T18:27:37.547Z`. `publicKey.x: gzAWXKluwNale_0CH24sV5BzAv5LQQsUdYJiKMD6HwA`.

---

## Was offen bleibt (für Folge-Sitzungen)

1. **Modul-01-`init`-Versions-Bump-Bug** (Diagnose 2). Eigene Pflege-Sitzung
   nötig, Brief noch nicht geschrieben. Manifestiert nur in `manual_check.html`
   bei wiederholtem Modul-Wechsel — Endknoten-PWAs sind nicht betroffen.

2. **Vollständiger Modul-06/07/00-Sichttest auf grüner DB.** Wartet auf #1
   grün — sobald Modul 01 stabil, sollten alle 84 Bridge-Stellen aus PR #130
   live grün laufen. Aktuell ist nur die Bridge-Logik **statisch verifiziert**
   (keine ungesuffixten Slot-Stores mehr per grep), **nicht** live durchgeklickt.

3. **Sage-Page Bento-Tabelle „Status".** Sollte nach #133 Sage als grünen
   LED zeigen (analog Rezeptbuch + Mixarium). Klaus hat das nicht
   explizit hard-reloaded und gegengeprüft — niedrige Priorität.

4. **Wizard-Identitäts-Wechsler Dropdown.** Klaus hat nicht getestet, ob
   `setActiveIdentity()` aus dem Dropdown sauber funktioniert. Sage hat in
   der Regel nur eine Identität — niedrige Priorität.

---

## Nächster sinnvoller Schritt

**Modul-01-Pflege als eigene Bau-Pflege-Sitzung.** Konkret:

1. Brief schreiben (`docs/sessions/BRIEF_PFLEGE_01_VERSIONS_BUMP_RACE.md`).
   Punkte: openProbe-Connection sauberer Close-Wait, `onversionchange`
   auch auf Probe-Connection, Sichttest-Trigger via PR #131-Notfall-Knopf
   reproduzierbar, KEIN PROTOCOL_VERSION/DB_VERSION-Bump.
2. Bau-Sitzung gegen den Brief. Klaus' Sichttest in der Galaxy-Tab-S6-
   Umgebung reproduzieren (selbe Browser-Quirks). Smoke-Tests headless.
3. Folge-Sichttest in `manual_check.html` Module 06/07/00 — die roten
   Knöpfe nach PR #130-Pflege.

**Alternativ:** wenn die Modul-01-Pflege Aufschub kann, der Sichttest in
`manual_check.html` läuft auch via **frischen Tab + Notfall-Reset-Knopf vor
jedem Modul-Wechsel** (Bedienungs-Disziplin statt Modul-Fix). Aber Klaus'
Lehre 4 aus Browser-Observatorium („Hard-Reload als Cache-Bust" + Modul-01-
init-fail-soft-Pflege 2026-05-19) zeigt: dauerhafte Lösungen kommen aus
dem Modul, nicht aus Bedienungs-Workarounds.

---

## Was diese Sitzung NICHT angefasst hat

- **Kein Modul-Code in `src/modules/*.js`.** Alle Pflegen waren in
  `tests/manual_check.html`, `index.html`, `CLAUDE.md`, `sbkim/spore.json`,
  `status.json`. PRs #127/#128/#129/#130/#131/#132/#133/#134.
- **Kein Spec-Eingriff in INTERFACES.md.** Keine Vertragsänderung.
- **Kein PROTOCOL_VERSION / DB_VERSION / BACKUP_FORMAT_VERSION Bump.**
- **Kein Eingriff in andere Endknoten-Repos** (Rezeptbuch / Mixarium).

---

## Übergabe für die nächste Sitzung

Wer immer die Modul-01-Pflege übernimmt, liest in dieser Reihenfolge:

1. `CLAUDE.md` (insbesondere § „Wer ist der Betreiber" / Arbeitsumgebung
   Galaxy Tab S6 — Klaus arbeitet ohne Konsole, alle Tests via Knöpfe).
2. `docs/PULS.md` (Schnellüberblick, dieses Übergabeprotokoll im Archiv-Index).
3. Dieses Übergabeprotokoll (Diagnose 2 enthält die Code-Pfad-Analyse).
4. `docs/components/01_storage.md` (Karte 01 § Versionsmigration).
5. `src/modules/01_storage.js` (insbesondere `openProbe` Zeile 484-523,
   `init()` Zeile 340-470, `ensureStore` Zeile 745-822, `attachVersionChangeHandler`
   Zeile 230-240).

**Brief-Nummer:** offen, vermutlich nicht V1-Sammelspec-Kaskade-Brief —
eher reguläre Pflege-Sitzung.

**PR-Nummer in der nächsten Sitzung:** voraussichtlich #135 (Brief) +
eine Bau-Pflege-Sitzung danach.
