# Prüf-Vermerk — sbkim/rezeptbuch_inbox.json (Mein-Rezeptbuch, eingegangen)

> Begleit-Vermerk zu `rezeptbuch_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/rezeptbuch_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Rezeptbuch/main/sbkim/spore.json`
  (Pages-URL `…github.io/Mein-Rezeptbuch/sbkim/spore.json` ist im Browser live; von Sages
  Container aus 403 — eigene github.io-Egress-Sperre, kein Pages-Problem)
- **Gelesen / geprüft:** 2026-06-07
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + Manipulationsprobe inline

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (= `uOpUBez…`) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `Rezeptbuch Klaus` · **nodeType:** `hybrid` · **domain:** `lausiklauskn-png.github.io`
- **nodeId (aktuell, kanonisch):** `uOpUBezUVbOMsVd2C9BkHW80agnLx5tCx_nIRy2KkXg`
- **publicKey.x:** `W2z4KxO3kVnmjr-E-zMLSEqxgqA59XeQWvhK6P8Z-CA`
- **createdAt:** `2026-05-24T05:58:14.642Z`
- **domainVector:** ✔ echt enthalten (384-dim, `Xenova/multilingual-e5-small`, L2 = 1)

## Identitäts-Abgleich (wichtig)

Sages `NETZ-STAND.md` + `status.json` führten Mein-Rezeptbuch bis 2026-06-07 unter der
**alten Handshake-nodeId `BSWxXmXvxF8FUR_MOx97a3l4gj1Q-JpcAJyp4BBRHyY`** (Stufe
`live-direct`, lokaler Einbau 16./17.05.2026). Die **aktuelle signierte Live-Identität**
auf `raw/main` ist `uOpUBez…` (createdAt 2026-05-24, also neuer). Dieselbe Identität führt
auch Mein-Tresor als `rezeptbuch_inbox.json`.

**Entscheidung (SYNC-VEREINBARUNG §7 / INTERFACES §11):** Bei Identitäts-Divergenz gewinnt
die **kryptografisch verifizierbare** signierte Spore. `uOpUBez…` ist damit die kanonische,
aktuelle Identität; `BSWxXmX…` (und die noch ältere `RHhposP0…`) wandern in
`previousNodeIds`. Kein Grund, die alte weiterzuführen.

## Stufe: `verified-match` (Cosinus 0.824068)

Identität kryptografisch bestätigt **und** echter Cross-Knoten-Match:

> **Sage ⟷ Mein-Rezeptbuch = 0.824068** (Modul 04 Cosinus, ≥ 0.80) → **`verified-match`**

Reproduzierbar: `node tools/verify_remote_spore.mjs sbkim/rezeptbuch_inbox.json` (Identität) +
Cosinus des `domainVector` aus `sbkim/spore.json` (Sage) gegen `sbkim/rezeptbuch_inbox.json`.
Deckt sich mit Mein-Rezeptbuchs eigener Browser-Rechnung (0.8241).

Damit ist Mein-Rezeptbuch — neben seinem historischen `live-direct`-Einbau — als
kryptografischer SBKIM-Knoten auf `verified-match` bestätigt (der **vierte verified-match**
im Netz neben SB·KIMTool·Point, Jasons-Tresor, Mein-Tresor).
