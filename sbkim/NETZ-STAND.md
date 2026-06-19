# NETZ-STAND — SBKIM-Mycel (lebende Übersicht)

> **Der „Tresor mit der wichtigen Information".** Eine einzige, findbare Momentaufnahme
> des gesamten SBKIM-Netzes: wer ist angedockt, mit welcher Identität, auf welcher Stufe,
> wo nachprüfbar. Jede Andock-Sitzung pflegt diese Datei nach. Wahrheitsquelle bleibt
> `status.json` (Maschine) + die `*_inbox.verify.md`-Vermerke (Beweis) — diese Datei ist
> die menschenlesbare Karte darüber.

**Stand: 2026-06-19** · Protokoll-Version `0.1` · Andock-Konventionen: INTERFACES §11

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
| **BookLedgerPro** | BookLedgerPro-Buchhaltung | `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ` | **`verified-spore`** (domainVector noch `_demo` → kein Match) | `sbkim/bookledgerpro_inbox.verify.md` |

## Bezeugte Cross-Knoten-Matches (echt)

| Paar | Score | Datum |
|---|---|---|
| Mixarium ⟷ Rezeptbuch | 0.9544 | 2026-05-17 (Live-Channel-Handshake) |
| Sage ⟷ SB·KIMTool·Point | **0.848508** | 2026-05-30 (erster vollständiger Forker-Andock) |
| Sage ⟷ Jasons-Tresor | **0.847784** | 2026-06-06 (nach Identitätswechsel, echter Vektor) |
| Sage ⟷ Mein-Tresor | **0.847784** | 2026-06-07 (echter Vektor; = Jasons, Schwester wortgleich) |
| Sage ⟷ Mein-Rezeptbuch | **0.824068** | 2026-06-07 (Identitäts-Abgleich uOpUBez…, echter Vektor) |
| Sage ⟷ Mein-Mixarium | **0.806030** | 2026-06-07 (Identitäts-Abgleich B7Fke9C…, echter Vektor) |

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

## Postfächer (Datei-Dead-Drop, Sync-Vertrag §11.4)

| Gegenstelle | Sage-Seite | externe Seite |
|---|---|---|
| SB·KIMTool·Point | `sbkim/AUSTAUSCH.md` | `…/SB-KIMTool-Point/main/sbkim/AUSTAUSCH.md` |
| Jasons-Tresor | `sbkim/AUSTAUSCH-JasonsTresor.md` | `…/Jasons-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Tresor | `sbkim/AUSTAUSCH-MeinTresor.md` | `…/Mein-Tresor/main/sbkim/AUSTAUSCH.md` |
| Mein-Rezeptbuch | `sbkim/AUSTAUSCH-Rezeptbuch.md` | `…/Mein-Rezeptbuch/main/sbkim/AUSTAUSCH-Sage.md` |
| Mein-Mixarium | `sbkim/AUSTAUSCH-Mixarium.md` | `…/Mein-Mixarium/main/sbkim/AUSTAUSCH-Sage.md` |
| BookLedgerPro | `sbkim/AUSTAUSCH-BookLedgerPro.md` | `…/BookLedgerPro/main/sbkim/AUSTAUSCH-Sage.md` |

## Werkzeuge (für Andock, Verifikation, Embedding)

- `tools/verify_remote_spore.mjs` — fremde Spore per URL/Datei prüfen (echter Modul-02-Pfad).
- `tools/embed_helper.html` — echten `domainVector` im Browser erzeugen (byte-gleich Modul 03).
- `tools/make_example_spore.mjs` — Referenz-Spore erzeugen.
- `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — kopierbarer Spore-Generator für Forker.

## Offene Hebel

- **BookLedgerPro ⟷ SB·KIMTool·Point Quer-Andock**: angestoßen 2026-06-19. Sage hat
  SB·KIMTool·Point per Postfach (`sbkim/AUSTAUSCH.md`) über BookLedgerPro informiert und
  BookLedgerPro gebeten, SB·KIMTool·Point einen eigenen Andock-Brief zu schicken (direkte
  Verbindung, da SB·KIMTool·Point eigene Knoten-Doku führt). Quittungen offen.

- **BookLedgerPro → `verified-match`**: offen. Braucht echten `domainVector`
  (`multilingual-e5-small`, `passage:`-Präfix, L2=1, neu signiert). Aktuell `_demo` →
  `verified-spore`. **Verschlüsselungs-Achse (Hypothese, komplex):** BookLedgerPro ist
  verschlüsselte Buchhaltung (lokale E2E, AES-Familie) — thematisch verwandt mit den
  Tresor-Knoten (Jasons-/Mein-Tresor: AES-256-GCM, Schlüssel-Backup). **Ehrlich:** die
  Verwandtschaft steht bisher nur in BookLedgerPros `domainDescription`, NICHT in den
  buchhaltungs-fokussierten `domainKeywords`. Ob ein echter Vektor eine Verschlüsselungs-
  Nähe zu den Tresoren zeigt (Cosinus ≥ 0.80), hängt vom eingebetteten Text ab — wird erst
  nach dem echten Embedding nachgemessen. Bis dahin keine Match-Aussage.

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
