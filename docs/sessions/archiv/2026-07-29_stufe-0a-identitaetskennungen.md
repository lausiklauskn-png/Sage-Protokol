# Übergabeprotokoll 2026-07-29 (Nacht) — Stufe 0a/0c/0d/0e (Identität haltbar machen)

**Rolle:** Bau-Sitzung.
**Auftrag:** `docs/sessions/BRIEF_STUFE0_IDENTITAET_HALTBAR.md` (Stufe 0).
**Branch (netzweit):** `claude/stufe-0a-identitaetskennungen-78ulx5` — je Repo frisch von `origin/main`.
**Berührte Repos:** Sage-Protokol · BookLedgerPro · Mein-Tresor · Jasons-Tresor · family-project · Kimboard.

---

## Ausgangslage

Klaus' Mycel-Analyse vom 2026-07-29 hat gezeigt: **die lebende `nodeId` eines Knotens überlebt
die Sitzung nicht** — der Browser räumt den „best effort"-Speicher einer nur im Tab geöffneten
github.io-Seite zwischen Sitzungen. Der Code ist korrekt (kein Neu-Erfinden beim Verbinden), der
Schlüssel geht **zwischen** den Sitzungen verloren. Verdacht: `navigator.storage.persist()` liefert
auf Android-Chrome `false`, wird aber nirgends angezeigt. Deshalb: **messen vor reparieren.**

## Was gebaut wurde (0a, 0c, 0d, 0e — 0b bewusst NICHT)

### 0a — messen (das Netz-Panel zeigt zwei ehrliche Zeilen)

- Kanonische Datei **`src/modules/23_rendezvous_ui.js`** (Sage) um zwei Status-Zeilen erweitert:
  - **„Meine Kennung: …"** — aus Modul 02 `getOwnSpore()` (async, fail-soft → „noch keine (erst
    verbinden)"). Voll angezeigt (word-break, monospace), damit Klaus exakt vergleichen kann.
  - **„Speicher dauerhaft: ja/nein/unbekannt"** — aus Modul 01 `SbkimStorage._meta.storagePersisted`
    (`true`→ja, `false`→nein + Klaus-Satz, `null`→unbekannt).
  - Neue `refreshStatus()`-Funktion, gerufen bei Mount, `show()` und nach Verbinden/Anmelden/
    Aufräumen (die Identität kann gerade erst entstanden sein). **Reine Anzeige, fail-soft, kein
    toter Knopf** (Fremdnutzer-/Marktplatz-Brille). Kern-Module **23/01/02 unangetastet**.
- **Byte-1:1-Rollout** (die UI-Datei ist in allen Apps byte-gleich zum Sage-Kanon): geändert
  **zuerst in Sage**, dann kopiert nach `sbkim-bundle/modules/`, `BookLedgerPro/sbkim/`,
  `Mein-Tresor/sbkim/`, `Jasons-Tresor/sbkim/`, `family-project/sbkim/`, `Kimboard/modules/`.
  Neuer sha256 `c05f0d8e…`; **Kimboards Drift-Guard-Pin** (`test/smoke.test.js`) nachgezogen.

### 0c — BookLedgerPro-Schubladen-Widerspruch geheilt

`sbkim/sbkim-init.js` rief Modul 23 zweimal mit `dbSuffix:"bookledgerpro"`, während die
App-Identität in `bookledgerpro-sbkim` liegt (`index.html:54` + `var DB_SUFFIX`). Beide Aufrufe
nutzen jetzt die **Variable `DB_SUFFIX`** — eine Quelle, kein zweiter Wert. Der *bestehende*
Suffix (`bookledgerpro-sbkim`) bleibt, damit die vorhandene Identität auffindbar bleibt. Keine
Phantom-DB `sbkim_bookledgerpro` wird mehr angelegt/gelöscht; der Migrations-/Hygiene-Pfad greift.

### 0d — die zwei Tresore wieder unterscheidbar

Ursache (wörtlich, in beiden Repos zeichengleich): `sbkim/sbkim-init.js` `RDV_CFG.domainDescription`
war der **generische** Satz „Verwahrt und verschlüsselt JSON-Dateien … Bibliothek/Tresor." und der
Einbettungstext bestand **nur** aus Beschreibung + Keywords → identischer Text → e5-Cosinus **1,0**.
Die guten, verschiedenen Beschreibungen lagen längst in `assets/siegel-inhalt.js` (WIZ), wurden vom
🌐-Anmelde-Pfad aber nie gelesen. **Fix:** RDV_CFG nutzt jetzt die **reiche, app-eigene** Beschreibung
(identisch zum Andock-Wizard). Jasons `scripts/generate_spore.mjs:25` mitgezogen (Mein-Tresors
Generator trug die reiche Beschreibung schon).

**Gegenprobe (headless, ehrlich):** der Einbettungs-Text war vorher **byte-identisch** zwischen den
Tresoren (= gemessener Live-Cosinus 1,000000), ist jetzt **verschieden**. Ein echtes e5-Modell ist
deterministisch → verschiedener Text ⇒ Cosinus < 1,0. **Der reale Browser-Cosinus wartet auf Klaus'
Lauf** (kein e5-Modell headless im Container). Die committete `spore.json` wurde **nicht** neu
generiert — ihr echter Browser-Vektor darf nicht durch den Demo-Stub (der nur nach `nodeName`
seedet) ersetzt werden.

### 0e — Register ehrlich

- `status.json`: neues Top-Feld **`identityNote`** (committet = Register-Wahrheitsquelle ≠ lebend =
  Raum-Identität; Modul 23 löst zur Laufzeit über den `nodeName` auf) + Notiz am **BookLedgerPro**-
  Eintrag (committet `MyHVM7Pd…` ≠ lebend `6oKgwHRp…`, cos 0.8337; **live v0.2**, Register v0.1).
  Ausdrücklich als **aus Klaus' Analyse übernommen, nicht neu verifiziert** markiert.
- `sbkim/NETZ-STAND.md`: gleicher committet-vs-lebend-Block + die Fünf-Knoten-Tabelle aus der Analyse.

## Beweis (headless, wahrheitsgemäß)

| Repo | Test | Ergebnis |
|---|---|---|
| Sage | `smoke_bau23_rendezvous_ui.mjs` | **87/87** (vorher 83, +4 neue 0a-Proben) |
| Sage | `smoke_bundle_connect.mjs` (Drift-Guard) | 21/21 |
| Sage | `smoke_bau23_rendezvous.mjs` | 59/59 |
| Sage | `smoke_bau23b_kartenechtheit.mjs` | 16/16 |
| Kimboard | `node --test` | **6/6** (Drift-Guard-Pin + 2 fehlende Modul-Kopien nachgetragen) |
| Mein-Tresor | `node --test` | 53/53 |
| Jasons-Tresor | `node --test` | 59/59 |
| BookLedgerPro | `tests/run.mjs` | 2153/0 |
| family-project | Nicht-Browser-Smokes (`smoke_spore`, `smoke_a5_antwortpfad`, `smoke_b3_safe_secret`) | grün |

**Befund am Rande (Kimboard main war schon rot):** `test/smoke.test.js` listete die tracked Dateien
`modules/echtheit.js` + `modules/relay_rotation.js` **nicht** im `EXPECTED_SHA256`-Manifest → der
Drift-Guard war auf `origin/main` bereits rot (ohne mein Zutun, mit gestashter Änderung reproduziert:
5 pass / 1 fail). Als Begleit-Fix beide mit ihrem echten sha256 nachgetragen → 6/6 grün. Klar
dokumentiert, kein stiller Workaround.

**family-project `smoke_all.mjs`** braucht `playwright-core` (nicht im Container installiert) — reiner
Browser-Test, keine Regression durch die reine Anzeige-Änderung.

**Browser-Sichttest ungeprüft — wartet auf Klaus' Browser-Lauf.** (Headless ersetzt ihn nicht.)

## Nicht angefasst (TABU eingehalten)

`23_rendezvous.js`, `01_storage.js`, `02_spore.js`, `04_match.js`, `05*_*.js` — kein Eingriff, kein
`PROTOCOL_VERSION`-/`DB_VERSION`-Bump, `PROVIDER_MIN_MATCH`/0.80-Andock-Riegel unberührt. Alles in
app-eigenem Klebstoff (`sbkim-init.js` / UI-Glue / status.json / NETZ-STAND.md) bzw. im Sage-Kanon
der UI-Datei (dann byte-kopiert).

## Netz-Sync

Sage `sbkim/SIGNAL.json` **seq 47 → 48** (Stufe 0a/0c/0d/0e gemeldet, Rück-Quittung erbeten).

## Nächster sinnvoller Schritt

1. **Klaus misst über Nacht** (0a): App öffnen → Kennung notieren → Hard-Reload → gleich? → App
   schließen → am nächsten Tag wieder öffnen → immer noch gleich?
2. **0b bauen** (nach der Messung): Installations-Hinweis genau bei „Speicher dauerhaft: nein",
   Sicherungs-Angebot wenn keine existiert, Wiederherstellen ins Panel. Kein Kern-Eingriff.
3. Erst danach **Stufe 3 „Bekannte bevorzugen"**.
