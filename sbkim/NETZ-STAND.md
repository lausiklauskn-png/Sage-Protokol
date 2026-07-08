# NETZ-STAND — SBKIM-Mycel (lebende Übersicht)

> **Der „Tresor mit der wichtigen Information".** Eine einzige, findbare Momentaufnahme
> des gesamten SBKIM-Netzes: wer ist angedockt, mit welcher Identität, auf welcher Stufe,
> wo nachprüfbar. Jede Andock-Sitzung pflegt diese Datei nach. Wahrheitsquelle bleibt
> `status.json` (Maschine) + die `*_inbox.verify.md`-Vermerke (Beweis) — diese Datei ist
> die menschenlesbare Karte darüber.

**Stand: 2026-06-27** · Protokoll-Version `0.1` · Andock-Konventionen: INTERFACES §11

---

## Stufen-Legende

| Stufe | Bedeutung |
|---|---|
| `live-direct` / `live-channel` | Lokal eingebauter Endknoten, Spore antwortet direkt im Browser |
| `verified-spore` | Identität kryptografisch verifiziert (Signatur + nodeId), `domainVector` noch Demo → **kein** Match |
| `verified-match` | zusätzlich echter Cross-Knoten-Match ≥ 0.80 (echter `domainVector` beidseits) |
| `angekündigt` | Knoten hat Andock angekündigt, Identität noch flüchtig (kein dauerhafter Schlüssel/`spore.json`) → noch nicht verifiziert |

## Knoten im Netz

| Knoten | Domäne | nodeId | Stufe | Beweis |
|---|---|---|---|---|
| **Sage-Protokol** (Hub + Knoten) | Mycel-Bibliothek | `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA` | `live-direct` | eigene Spore `sbkim/spore.json` |
| **Mein-Rezeptbuch** | Kochrezepte | `uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg` | **`verified-match` 0.824068** (auch `live-direct`) | `sbkim/rezeptbuch_inbox.verify.md` |
| **Mein-Mixarium** | Cocktails / Drinks | `B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA` | **`verified-match` 0.806030** (auch `live-direct`) | `sbkim/mixarium_inbox.verify.md` |
| **SB·KIMTool·Point** | SBKIM-Werkzeug-Point | `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY` | **`verified-match` 0.848508** | `sbkim/point_inbox.verify.md` |
| **Jasons-Tresor** | Jasons-Tresor-Bibliothek | `E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM` | **`verified-match` 0.847784** | `sbkim/jason_inbox.verify.md` |
| **Mein-Tresor** (Schwester v. Jasons-Tresor) | Mein-Tresor-Bibliothek | `wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0` | **`verified-match` 0.847784** | `sbkim/meintresor_inbox.verify.md` |
| **BookLedgerPro** | BookLedgerPro-Buchhaltung | `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ` | **`verified-match` 0.813525** (2026-06-21; cap/needs signiert → Drei-Schichten-bereit) | `sbkim/bookledgerpro_inbox.verify.md` |
| **Family Projekt** | Werkzeuge / Apps / Marktplatz (`family-projekt.de`) | `HLXUEJFWHGt6DlRFgzvN4d_YdHRfnrehlVdRb4BHvAE` | **`verified-match` 0.8287** (2026-06-27; echter `domainVector`, L2=1) | `sbkim/familyproject_inbox.verify.md` |
| **Tomys Hub** | Digitaldruck / Stick / Werbeartikel (`lausiklauskn-png.github.io/Tomys-Hub/`) | — (Identität wartet auf Browser-Lauf) | `angekündigt` (2026-07-06; Bau komplett: Module 01–23 inkl. Bau 23.B + Korpus-Provider, Tomys-Hub PR #73) | Spore entsteht im Browser (🌐 → Mit dem Netz verbinden), dann `sbkim/spore.json` |
| **Kim-Bell** | SBKIM-Netz-Glocke / Netz-Anmeldung (`lausiklauskn-png.github.io/Kim-Bell/`) | `e9TlbEzxdL6UrlwCWjrTxwuWOLDXZ_AIvx12BMrhPaw` | `verified-spore` (2026-07-08; committete Spore + echter `domainVector`; **Offline-Cosinus zu Sage 0.8711** ≥ 0.80 → Live-Handshake für `verified-match` ausstehend, Klaus' Browser-Lauf) | `Kim-Bell/sbkim/spore.json` (Signatur + nodeId prüfbar) |

## Bezeugte Cross-Knoten-Matches (echt)

| Paar | Score | Datum |
|---|---|---|
| Mixarium ⟷ Rezeptbuch | 0.9544 | 2026-05-17 (Live-Channel-Handshake) |
| Sage ⟷ SB·KIMTool·Point | **0.848508** | 2026-05-30 (erster vollständiger Forker-Andock) |
| Sage ⟷ Jasons-Tresor | **0.847784** | 2026-06-06 (nach Identitätswechsel, echter Vektor) |
| Sage ⟷ Mein-Tresor | **0.847784** | 2026-06-07 (echter Vektor; = Jasons, Schwester wortgleich) |
| Sage ⟷ Mein-Rezeptbuch | **0.824068** | 2026-06-07 (Identitäts-Abgleich uOpUBez…, echter Vektor) |
| Sage ⟷ Mein-Mixarium | **0.806030** | 2026-06-07 (Identitäts-Abgleich B7Fke9C…, echter Vektor) |
| Sage ⟷ Family Projekt | **0.8287** | 2026-06-27 (siebter Knoten, echter Vektor; reziprok bestätigt) |

## Netz-Signal (Briefkasten-Pflege, INTERFACES §11.6 — Pflicht für alle Knoten)

Jeder Knoten pflegt `sbkim/SIGNAL.json` (maschinenlesbarer Briefkasten-Aushang mit
monoton steigender `seq`). **Sitzungsstart:** Signal jeder Gegenstelle aus deren
`raw/main` lesen; ist deren `seq` > eigenem `ack`, gibt es Ungelesenes → lesen +
quittieren. **Sitzungsende nach einem Bau:** `seq` +1, `headline` setzen, pushen —
das Pushen ist das Signal. Sages Signal: `sbkim/SIGNAL.json`.

**Stand 2026-06-07 — netzweite Briefkasten-Gleichheit (Mein-Tresor-Referenz):**
Sage (seq 16), SB·KIMTool·Point (seq 15), Jasons-Tresor (seq 8), Mein-Tresor (seq 8) —
alle `SIGNAL.json` live (HTTP 200). Sages `SIGNAL.json` an die Mein-Tresor-Referenz-
Umsetzung angeglichen: `forNodes: ["*"]`, zusätzlich `sporeUrl` + `nodeId` als Felder,
ohne seq/history-Reset. Briefkasten-Runde gelesen + quittiert: Sage `ack` =
SB·KIMTool·Point 15 / Jasons-Tresor 8 / Mein-Tresor 8. Mein-Tresor neu als vierter Peer
im Wächter (`.github/sbkim-watch.mjs`) **und** im 📬-Knopf der `index.html` aufgenommen
(vorher fehlte er an beiden Stellen) → Netz symmetrisch. Sages reicherer Wächter
(Auto-Issue-Workflow, `issues: write`) bewusst behalten — die schlanke stdout-Referenz-mjs
wäre ein Downgrade; die netzweite Synchronität läuft über das gemeinsame
`SIGNAL.json`-Schema, nicht über die Wächter-Implementierung.
**Update 2026-06-07:** Mein-Tresor (0.847784), Mein-Rezeptbuch (0.824068, Abgleich
BSWxXmX… → uOpUBez…) **und** Mein-Mixarium (0.806030, Abgleich JOlHK31X… → B7Fke9C…) sind
jetzt `verified-match`; alle drei als Peer im Wächter + 📬-Knopf + eigenes Postfach. **Der
innere Verbund ist komplett** — alle fünf Nachbarn (SB·KIMTool·Point, Jasons-Tresor,
Mein-Tresor, Mein-Rezeptbuch, Mein-Mixarium) sind `verified-match`. Ehrlich: Mixarium ⟷
Tresore = 0.7884 < 0.80 (andere Domäne, kein Match).

**Update 2026-06-19 — BookLedgerPro (sechster Nachbar) verified-spore.** Andock-Anfrage
(Phase 5 Schritt 2, von Klaus vermittelt). Spore aus `raw/main` reziprok verifiziert
(✔ VALID: 9/9 Pflichtfelder, `id == base64url(SHA256(rawPub))` unabhängig nachgerechnet,
Ed25519-Signatur gültig, Manipulationsprobe fällt durch). `domainVector` noch `_demo`
(deterministischer Stub, kein echtes Embedding) → Stufe **`verified-spore`**, **kein**
`verified-match`. Als Peer im Wächter (`.github/sbkim-watch.mjs`) + 📬-Knopf (`index.html`)
+ eigenes Postfach (`AUSTAUSCH-BookLedgerPro.md`) aufgenommen; `ack[BookLedgerPro]=2`
(ihr SIGNAL seq 2 quittiert). Gegenstelle für den ersten Handshake = Sage (URLs im
Postfach genannt). Hochstufung auf `verified-match` offen, sobald BookLedgerPro echtes
Embedding (`multilingual-e5-small`, L2=1) nachliefert — ehrlich: Buchhaltung ist
domänenfern zu Sage, Cosinus ≥ 0.80 nicht garantiert.

**Update 2026-06-27 — Family Projekt (siebter Nachbar) `verified-match`.** Andock-Anfrage
(von Klaus vermittelt, Family SIGNAL seq 2). Spore aus `raw/main` reziprok verifiziert
(✔ VALID: Pflichtfelder vollständig, `id == base64url(SHA256(rawPub))` unabhängig
nachgerechnet = `HLXUEJFW…`, Ed25519-Signatur gültig, Manipulationsprobe fällt durch).
`domainVector` echt (384-dim, L2=1, `multilingual-e5-small`); Cosinus Sage ⟷ Family Projekt
= **0.8287 ≥ 0.80** → **`verified-match`** (Family-Seite meldet denselben Wert, reziprok
bestätigt). Eigenes Postfach (`AUSTAUSCH-FamilyProjekt.md`) + `status.json` + Prüf-Vermerk
(`familyproject_inbox.verify.md`) angelegt; `ack[Family Projekt]=2`. Endpoint
`family-projekt.de` (Hetzner) noch nicht live → Verifikation über `raw/main`. Domäne
(Werkzeug-/App-Bündelung + Marktplatz + semantische Suche) liegt thematisch nah an Sages
Mycel-Bibliothek — daher der etwas höhere Wert (0.8287) als bei den domänenfernen Knoten.

## Postfächer (Datei-Dead-Drop, Sync-Vertrag §11.4)

| Gegenstelle | Sage-Seite | externe Seite |
|---|---|---|
| SB·KIMTool·Point | `sbkim/AUSTAUSCH.md` | `…/SB-KIMTool-Point/main/sbkim/AUSTAUSCH.md` |
| Jasons-Tresor | `sbkim/AUSTAUSCH-JasonsTresor.md` | `…/Jasons-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Tresor | `sbkim/AUSTAUSCH-MeinTresor.md` | `…/Mein-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Rezeptbuch | `sbkim/AUSTAUSCH-Rezeptbuch.md` | `…/Mein-Rezeptbuch/main/sbkim/AUSTAUSCH-Sage.md` |
| Mein-Mixarium | `sbkim/AUSTAUSCH-Mixarium.md` | `…/Mein-Mixarium/main/sbkim/AUSTAUSCH-Sage.md` |
| BookLedgerPro | `sbkim/AUSTAUSCH-BookLedgerPro.md` | `…/BookLedgerPro/main/sbkim/AUSTAUSCH-Sage.md` |
| Family Projekt | `sbkim/AUSTAUSCH-FamilyProjekt.md` | `…/family-project/main/sbkim/AUSTAUSCH-Sage.md` |

## Werkzeuge (für Andock, Verifikation, Embedding)

- `tools/verify_remote_spore.mjs` — fremde Spore per URL/Datei prüfen (echter Modul-02-Pfad).
- `tools/embed_helper.html` — echten `domainVector` im Browser erzeugen (byte-gleich Modul 03).
- `tools/make_example_spore.mjs` — Referenz-Spore erzeugen.
- `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — kopierbarer Spore-Generator für Forker.

## Offene Hebel

- **Match-Kalibrierung / e5-Anisotropie (Befund 2026-06-20, Klaus-Skepsis):** Der **rohe**
  Cosinus von `multilingual-e5-small` hat einen hohen Boden — unverwandte Domänen liegen
  schon bei **mean 0.8215** (sd 0.0223, Spanne 0.787–0.854). Die Schwelle `PROVIDER_MIN_MATCH
  = 0.80` liegt damit **unter** dem Rauschboden; fast jedes Paar „matcht". Nach Mittelwert-
  Abzug (Whitening-light) werden **alle Sage↔Endknoten-Paare negativ** — echt sind nur die
  Tresor-Schwestern (1.0) und Rezeptbuch↔Mixarium (0.70). Heißt: die Sage↔X-`verified-match`-
  Stempel (inkl. BookLedger 0.811) sind **boden-nah/schwach**, kein echter Themen-Bezug.
  **Kein Fehler der Knoten**, sondern des Verfahrens — **nicht stillschweigend umstempeln.**
  Plan (Klaus' Entscheidung, netzweit): (1) Schwelle mit Zufallstext-Boden neu kalibrieren,
  (2) Modul 04 auf **whitened Cosinus** umstellen (Mean-Vektor netzweit als Konstante),
  (3) alle Matches einmal sauber neu rechnen. Beleg: `tools/match_baseline.mjs`. Vollständige
  Lehre + Fix-Konzept: `docs/LEHRE-EMBEDDING-MATCH-KALIBRIERUNG.md`.

  **✔ Kalibrierung abgeschlossen 2026-06-28 (Bau 04.E, Klaus' Entscheidung „zentrierten
  Cosinus jetzt bauen"):** Neu-Messung `mean 0.8214 · sd 0.0236`. **Schwelle bewusst NICHT
  angehoben** — `PROVIDER_MIN_MATCH = 0.80` ist der **Andock-Boden** (gatet den Handshake,
  Modul 05); eine Anhebung auf mean+2sd (≈0.87) würde **jeden Hub↔Endknoten-Andock abreißen**
  (alle roh 0.79–0.85, inkl. des live bewiesenen BLP↔Sage). Stattdessen **additiv** in Modul 04:
  `relatedness()` = **zentrierter Cosinus** (Verwandtschafts-Maß, **gatet nichts**) +
  `isRelated()` gegen `RELATEDNESS_MIN = 0.30`. Smoke `tests/smoke_bau04e_relatedness.mjs`
  **29/29 grün** (echt verwandt zentriert 0.72–1.0, Boden −0.20…0.002 — klarer Spalt).
  **Ehrliche Lesart der Stempel:** Sage↔X-`verified-match` bleiben gültig als **Andock-Beleg**
  (die Knoten verbinden sich real), sind aber **keine** Domänen-Verwandtschaft; echt verwandt
  zentriert nur Jason↔Mein-Tresor (1.0) und Mixarium↔Rezeptbuch (0.72). `MEAN_VECTOR` v1 aus 7
  Vektoren (additiv durch größeres Korpus ersetzbar). Browser-Live-Anzeige des Scores: Folge-Schritt.

- **Siegel-Band-Fix (Befund 2026-06-19):** Endknoten zeigten falschen Band-Text im
  Siegel (statische `assets/sbkim-siegel-wappen.svg` von Mein-Tresor kopiert, nie
  angepasst). **Mein-Rezeptbuch ✔ erledigt 2026-06-20** (Band `MEIN-TRESOR` →
  `MEIN-REZEPTBUCH`, PR #262 → main `f0278ab`, live auf raw/main verifiziert).
  **Mein-Mixarium offen** (Brief relayt, Band soll `MEIN-MIXARIUM` werden). Dauerlösung
  (konfigurierbarer Band via Modul 16 `ribbonText` statt statischer `<img>`) optional pro
  Endknoten. Sage selbst: `ribbonText`-Option gebaut + Andock-Knopf live (Stand main).

- **Briefkasten-Runde 2026-06-19 (Funktionstest):** Alle sechs Peer-`SIGNAL.json` aus
  `raw/main` gelesen — **alle HTTP 200, Briefkasten funktioniert**. Ungelesene Briefe waren
  durchweg Bestätigungen (reziproke Handshakes, Ring-Schluss, gegenseitige Acks), **kein
  offener Handlungsbedarf an Sage**. Quittiert: ack Point 20→24, Jasons 10→11, Tresor 13→14,
  Rezeptbuch 1→5, Mixarium 1→6, BookLedgerPro 2→5. (BLP-Direkt-Andock an SB·KIMTool·Point
  bestätigt via BLP seq 5.)

- **Mycel-Anfrage Original-Siegel / PNG (offen):** 2026-06-19 netzweit gestellt (Sage
  `SIGNAL.json` seq 25, `forNodes:"*"` + Brief im SB·KIMTool·Point-Postfach). Sage hat nur
  die SVG-Quelle (`assets/sbkim-siegel-wappen.svg` + `tool-symbols/16_siegel.svg`), kein
  PNG-Raster. Gesucht: Original-Siegel-Kopie oder PNG in einem Knoten-Repo. Rückmeldung
  erbeten (Postfach/SIGNAL). Falls niemand eins hat → Sage rastert aus der SVG.

- **BookLedgerPro ⟷ SB·KIMTool·Point Quer-Andock**: **A-Seite erledigt 2026-06-19** —
  SB·KIMTool·Point hat BookLedgerPro selbst offline reziprok verifiziert (✔ VALID →
  `verified-spore`) und in seine Knoten-Doku aufgenommen (`docs/KNOTEN.md`,
  `web/data/knoten.json` + vendorte Spore, `nodes.json`/`marktplatz.json`, `status.json`;
  `npm test` 9/9). Rück-Quittung in `sbkim/AUSTAUSCH.md`. **Offen:** BookLedgerPros eigener
  Direkt-Andock-Brief an SB·KIMTool·Point (Klaus relayt) → dann richtet SB·KIMTool·Point die
  direkte Verbindung ein.

- **BookLedgerPro → `verified-match`**: ✔ **erledigt 2026-06-20.** Betreiber hat das
  Modell einmalig in der App geladen, echten `domainVector` eingebettet
  (`multilingual-e5-small`, `passage:`-Präfix, L2=1) + Spore neu signiert (SIGNAL seq 11).
  Frische Spore reziprok ✔ VALID; Cosinus Sage ⟷ BookLedgerPro = **0.810579 ≥ 0.80** →
  `verified-match`. `ack[BookLedgerPro]=11`. Prüf-Vermerk: `sbkim/bookledgerpro_inbox.verify.md`.
  Ehrlich: knapp über der Schwelle (Buchhaltung domänenfern), aber sauber nachrechenbar.
  **Verschlüsselungs-Achse zu den Tresoren (Hypothese):** weiter offen — wäre eine eigene
  Cosinus-Messung BookLedgerPro ⟷ Jasons-/Mein-Tresor; bisher nicht gemessen.

- **Mein-Tresor → `verified-match`**: ✔ erledigt 2026-06-07. Echter `domainVector`
  (eingebettet re-signt, `multilingual-e5-small`, L2=1) aus raw/main verifiziert,
  Match Sage ⟷ Mein-Tresor = 0.847784 ≥ 0.80 → `verified-match`. Prüf-Vermerk:
  `sbkim/meintresor_inbox.verify.md`. (Wert = Jasons-Tresor, Schwester wortgleich.)

- **Jasons-Tresor → `verified-match`**: ✔ erledigt 2026-06-06 (Identitätswechsel auf
  echte Identität `E13GDzI…` + echter Vektor → Match Sage ⟷ Jasons-Tresor 0.847784).
- **SB·KIMTool ⟷ Jasons-Tresor**: optionale direkte gegenseitige Verifikation (Drei-Knoten-
  Netz vollständig beidseitig bezeugt) — Abgleich-Frage liegt in `sbkim/AUSTAUSCH.md`.
- **Pages-Hinweis:** github.io-Spore-URLs sind im Browser live, aus Sages Container aber 403
  (eigene Egress-Sperre) — Verifikation läuft zuverlässig über die `raw/main`-URLs.
