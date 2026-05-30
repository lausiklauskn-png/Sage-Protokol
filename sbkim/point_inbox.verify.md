# Prüf-Vermerk — sbkim/point_inbox.json (SB·KIMTool·Points Spore, eingegangen)

> Begleit-Vermerk zu `point_inbox.json` (Inbox-Konvention nach SB·KIMTool ANDOCK §6.2:
> „signatur-reine Kopie + Prüf-Vermerk", von Sage reziprok übernommen). Die `.json`
> daneben ist eine **originalgetreue, unveränderte** Kopie der Spore — bewusst
> signatur-rein (kein Zusatzfeld, das die Signatur zerstören würde). Dieser Vermerk
> hält das Prüf-Ergebnis fest; der reproduzierbare Beweis ist
> `node tools/verify_remote_spore.mjs sbkim/point_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/SB-KIMTool-Point/main/sbkim/spore.json`
- **Gelesen / geprüft:** 2026-05-30
- **Verifizierer:** `tools/verify_remote_spore.mjs` (headless, fährt den echten Modul-02-Pfad `SbkimSpore.verifyForeignSpore`, WebCrypto, kanonische Form)
- **Befehl:** `node tools/verify_remote_spore.mjs sbkim/point_inbox.json`

## Ergebnis: ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| Pflichtfelder (inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `SB-KIMTool-Point` · **nodeType:** `hybrid` · **domain:** `SBKIM-Werkzeug-Point`
- **nodeId:** `eC3jzoo9Oii04KiSYBXEWhPQzAe6ezmDFKDo1_i0zdw`
- **publicKey.x:** `EEh2TQMlFvjuXSC5vSBg7texX_kYH0YQNjQz-RdlG0c`
- **domainVector:** 384 Floats, ehrlich als `_demo`-Stub markiert (noch kein echtes Embedding)

Damit ist die Andock-Identität **beidseitig** kryptografisch bestätigt — eure kanonische
Form (`node:crypto`) und unsere (`WebCrypto`, Modul 02) sind byte-deckungsgleich.
Der **echte semantische Match** folgt erst, wenn euer `domainVector` ein echtes
Embedding ist (siehe Postfach § Embedding-Lieferung).
