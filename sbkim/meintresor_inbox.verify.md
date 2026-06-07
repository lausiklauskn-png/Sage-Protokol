# Prüf-Vermerk — sbkim/meintresor_inbox.json (Mein-Tresor, eingegangen)

> Begleit-Vermerk zu `meintresor_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/meintresor_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Tresor/main/sbkim/spore.json`
  (Pages-URL `…github.io/Mein-Tresor/sbkim/spore.json` ist im Browser live; von Sages
  Container aus 403 — eigene github.io-Egress-Sperre, kein Pages-Problem)
- **Gelesen / geprüft:** 2026-06-06 (verified-spore) · **2026-06-07 (verified-match, frische Spore mit echtem domainVector)**
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
- **domainVector:** ✔ **echt enthalten** (384-dim, `Xenova/multilingual-e5-small`, L2 = 1) —
  frische Spore aus raw/main 2026-06-07 (Mein-Tresor hat eingebettet re-signt, nodeId blieb gleich).

## Stufe: `verified-match` (Cosinus 0.847784)

Identität kryptografisch bestätigt (eigener, dauerhafter Ed25519-Schlüssel — **eigene**
nodeId, verschieden von der Schwester Jasons-Tresor) **und** echter Cross-Knoten-Match:

> **Sage ⟷ Mein-Tresor = 0.847784** (Modul 04 Cosinus, ≥ 0.80) → **`verified-match`**

Reproduzierbar: `node tools/verify_remote_spore.mjs sbkim/meintresor_inbox.json` (Identität) +
Cosinus des `domainVector` aus `sbkim/spore.json` (Sage) gegen `sbkim/meintresor_inbox.json`
(Mein-Tresor). Der Wert ist **identisch zu Sage ⟷ Jasons-Tresor (0.847784)**, weil Mein-Tresor
die design-vereinfachte Schwester mit wortgleichem Domänen-Text ist → gleicher Vektor.

Damit ist Mein-Tresor der **vierte** über das SBKIM-Protokoll verifizierte Forker-Knoten und
der **dritte verified-match** im Netz (neben SB·KIMTool·Point 0.848508 und Jasons-Tresor 0.847784).
