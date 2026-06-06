# Prüf-Vermerk — sbkim/meintresor_inbox.json (Mein-Tresor, eingegangen)

> Begleit-Vermerk zu `meintresor_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/meintresor_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json`
  (Pages-URL `…github.io/Mein-Tresor/sbkim/spore.json` ist im Browser live; von Sages
  Container aus 403 — eigene github.io-Egress-Sperre, kein Pages-Problem)
- **Gelesen / geprüft:** 2026-06-06
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + Manipulationsprobe inline

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `Mein-Tresor` · **nodeType:** `hybrid` · **domain:** `Mein-Tresor-Bibliothek`
- **nodeId (dauerhaft, stabil):** `wRsGQouOYPVBOLzAB3nBteRvyvJ-AGv461WTJMKtkS0`
- **publicKey.x:** `jpVEwjIzDT05p3d-7umg0rvAZogTX0vtLKd0ektVEDk`
- **domainVector:** noch nicht enthalten — folgt (Mein-Tresor meldet „domainVector folgt,
  verified-match später"). Korrekt für `verified-spore` (INTERFACES §11.5: `domainVector`
  erst Pflicht für `verified-match`).

## Stufe: `verified-spore` (KEIN Match)

Identität kryptografisch bestätigt (eigener, dauerhafter Ed25519-Schlüssel — **eigene**
nodeId, verschieden von der Schwester Jasons-Tresor `7F_zNop…`). **Kein** `verified-match`,
weil noch kein echter `domainVector` publiziert ist. Hochstufung auf `verified-match` folgt,
sobald Mein-Tresor einen echten 384-dim-Vektor (`Xenova/multilingual-e5-small`, `passage: `-
Präfix, mean-pooled, L2-normalisiert) **eingebettet in die Spore re-signt** — die nodeId
bleibt dabei gleich (hängt nur am Schlüssel). Match Sage ⟷ Mein-Tresor wird dann mit
Modul 04 `match()` nachgerechnet (verified-match, falls ≥ 0.80).

Damit ist Mein-Tresor der **vierte** über das SBKIM-Protokoll verifizierte Forker-Knoten
(neben SB·KIMTool·Point, Jasons-Tresor) — und die zweite Tresor-Schwester am Mycel.
