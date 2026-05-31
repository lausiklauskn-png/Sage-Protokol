# NETZ-STAND — SBKIM-Mycel (lebende Übersicht)

> **Der „Tresor mit der wichtigen Information".** Eine einzige, findbare Momentaufnahme
> des gesamten SBKIM-Netzes: wer ist angedockt, mit welcher Identität, auf welcher Stufe,
> wo nachprüfbar. Jede Andock-Sitzung pflegt diese Datei nach. Wahrheitsquelle bleibt
> `status.json` (Maschine) + die `*_inbox.verify.md`-Vermerke (Beweis) — diese Datei ist
> die menschenlesbare Karte darüber.

**Stand: 2026-05-31** · Protokoll-Version `0.1` · Andock-Konventionen: INTERFACES §11

---

## Stufen-Legende

| Stufe | Bedeutung |
|---|---|
| `live-direct` / `live-channel` | Lokal eingebauter Endknoten, Spore antwortet direkt im Browser |
| `verified-spore` | Identität kryptografisch verifiziert (Signatur + nodeId), `domainVector` noch Demo → **kein** Match |
| `verified-match` | zusätzlich echter Cross-Knoten-Match ≥ 0.80 (echter `domainVector` beidseits) |

## Knoten im Netz

| Knoten | Domäne | nodeId | Stufe | Beweis |
|---|---|---|---|---|
| **Sage-Protokol** (Hub + Knoten) | Mycel-Bibliothek | `nysOZE3VuKqZA23i5G2XL67s41JIIykI58zXMtJkYfA` | `live-direct` | eigene Spore `sbkim/spore.json` |
| **Mein-Rezeptbuch** | Kochrezepte | `BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY` | `live-direct` | Cross-Knoten-Handshake 2026-05-16/17 |
| **Mein-Mixarium** | Cocktails / Drinks | `JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY` | `live-direct` | Cross-Knoten-Handshake 2026-05-17 |
| **SB·KIMTool·Point** | SBKIM-Werkzeug-Point | `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY` | **`verified-match` 0.848508** | `sbkim/point_inbox.verify.md` |
| **Jasons-Tresor** | Jasons-Tresor-Bibliothek | `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs` | **`verified-spore`** | `sbkim/jason_inbox.verify.md` |

## Bezeugte Cross-Knoten-Matches (echt)

| Paar | Score | Datum |
|---|---|---|
| Mixarium ⟷ Rezeptbuch | 0.9544 | 2026-05-17 (Live-Channel-Handshake) |
| Sage ⟷ SB·KIMTool·Point | **0.848508** | 2026-05-30 (erster vollständiger Forker-Andock) |

## Netz-Signal (Briefkasten-Pflege, INTERFACES §11.6 — Pflicht für alle Knoten)

Jeder Knoten pflegt `sbkim/SIGNAL.json` (maschinenlesbarer Briefkasten-Aushang mit
monoton steigender `seq`). **Sitzungsstart:** Signal jeder Gegenstelle aus deren
`raw/main` lesen; ist deren `seq` > eigenem `ack`, gibt es Ungelesenes → lesen +
quittieren. **Sitzungsende nach einem Bau:** `seq` +1, `headline` setzen, pushen —
das Pushen ist das Signal. Sages Signal: `sbkim/SIGNAL.json`.

## Postfächer (Datei-Dead-Drop, Sync-Vertrag §11.4)

| Gegenstelle | Sage-Seite | externe Seite |
|---|---|---|
| SB·KIMTool·Point | `sbkim/AUSTAUSCH.md` | `…/SB-KIMTool-Point/main/sbkim/AUSTAUSCH.md` |
| Jasons-Tresor | `sbkim/AUSTAUSCH-JasonsTresor.md` | `…/Jasons-Tresor/main/sbkim/AUSTAUSCH.md` |

## Werkzeuge (für Andock, Verifikation, Embedding)

- `tools/verify_remote_spore.mjs` — fremde Spore per URL/Datei prüfen (echter Modul-02-Pfad).
- `tools/embed_helper.html` — echten `domainVector` im Browser erzeugen (byte-gleich Modul 03).
- `tools/make_example_spore.mjs` — Referenz-Spore erzeugen.
- `sbkim/fuer-SB-KIMTool-Point/generate_spore.mjs` — kopierbarer Spore-Generator für Forker.

## Offene Hebel

- **Jasons-Tresor → `verified-match`**: echter `domainVector` (Re-Sign oder Sage rechnet),
  dann Match Sage ⟷ Jasons-Tresor nachrechnen.
- **SB·KIMTool ⟷ Jasons-Tresor**: optionale direkte gegenseitige Verifikation (Drei-Knoten-
  Netz vollständig beidseitig bezeugt) — Abgleich-Frage liegt in `sbkim/AUSTAUSCH.md`.
- **Pages-Hinweis:** github.io-Spore-URLs sind im Browser live, aus Sages Container aber 403
  (eigene Egress-Sperre) — Verifikation läuft zuverlässig über die `raw/main`-URLs.
