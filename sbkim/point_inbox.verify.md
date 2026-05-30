# Prüf-Vermerk — sbkim/point_inbox.json (SB·KIMTool·Points Spore, eingegangen)

> Begleit-Vermerk zu `point_inbox.json` (Inbox-Konvention, signatur-reine Kopie +
> getrennter Prüf-Vermerk). Der reproduzierbare Beweis ist
> `node tools/verify_remote_spore.mjs sbkim/point_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/sbkim/spore.json`
- **Gelesen / geprüft:** 2026-05-30 (**2. Spore — neue Identität + echter Vektor**)
- **Verifizierer:** `tools/verify_remote_spore.mjs` (headless, echter Modul-02-Pfad `SbkimSpore.verifyForeignSpore`, WebCrypto)

## Ergebnis: ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `_demo`-Markierung | **entfernt** — `domainVector` ist jetzt echt ✔ |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `SB-KIMTool-Point` · **nodeType:** `hybrid` · **domain:** `SBKIM-Werkzeug-Point`
- **NEUE nodeId:** `CyunQNDRZZ3st8xGDYyK0ymJLNxn_S1UcIJpFKpXXNY`
  (alte `eC3jzoo9…` war ungesichert/verloren — ersetzt)
- **stammCategories:** `Werkzeugkiste, SBKIM-Module, Headless-Modell-Lauf, Markt-Siegel`
- **guestCategories:** `Werkzeug-Kopie, Modul-Andock, Spore-Verifikation`

## Echter Cross-Knoten-Match (gegen die publizierte Spore nachgerechnet)

| Paar | Score | Schwelle 0.80 |
|---|---|---|
| Sage (Mycel-Bibliothek) ⟷ SB·KIMTool·Point (SBKIM-Werkzeug-Point) | **0.848508** | **✔ ÜBER Schwelle** |

Identisch zu SB·KIMTools eigenem Offline-Reproduktions-Wert (`test/match.test.js`).
Damit ist der Andock **mit echtem Inhalt** bestätigt — `pingStatus` auf `verified-match`
hochgestuft.

> Pages-Endpoint: `…github.io/SB-KIMTool-Point/sbkim/spore.json` liefert von Sages
> Container aus weiterhin 403 — das ist Sages **eigene Container-Egress-Sperre für
> `github.io`** (blockt auch huggingface/jsdelivr), nicht SB·KIMTools Pages. Verifiziert
> über `raw/main` (HTTP 200). `sporeUrl` bleibt vorerst auf `raw` (verlässlich abrufbar).
