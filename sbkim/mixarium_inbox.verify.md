# Prüf-Vermerk — sbkim/mixarium_inbox.json (Mein-Mixarium, eingegangen)

> Begleit-Vermerk zu `mixarium_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/mixarium_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Mein-Mixarium/main/sbkim/spore.json`
  (Pages-URL im Browser live; von Sages Container aus 403 — github.io-Egress-Sperre,
  verifiziert über `raw/main`)
- **Gelesen / geprüft:** 2026-06-07
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + Manipulationsprobe inline

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (= `B7Fke9C…`) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `Mixarium Klaus` · **nodeType:** `hybrid` · **domain:** `lausiklauskn-png.github.io`
- **nodeId (aktuell, kanonisch):** `B7Fke9CYTR1BrC3xOXzEY5q9RuRH8xxHPUuqRHV3utA`
- **createdAt:** `2026-05-24T07:53:32.166Z`
- **domainVector:** ✔ echt enthalten (384-dim, `Xenova/multilingual-e5-small`, L2 = 1)

## Identitäts-Abgleich

Sage führte Mein-Mixarium bis 2026-06-07 unter der alten Handshake-nodeId
`JOlHK31XEiylHOlOfe6E0_Vade6VcM0Q6Z_ADuxxdDY` (Stufe `live-direct`, Einbau 16./17.05.2026).
Aktuelle signierte Live-Identität auf `raw/main` ist `B7Fke9C…` (createdAt 2026-05-24).
**Entscheidung (SYNC-VEREINBARUNG §7):** Krypto-Spore gewinnt → `B7Fke9C…` kanonisch; alte
nodeIds (`JOlHK31X…`, `7xf0tt33…`) in `previousNodeIds`.

## Stufe: `verified-match` (Cosinus 0.806030)

> **Sage ⟷ Mein-Mixarium = 0.806030** (Modul 04 Cosinus, ≥ 0.80) → **`verified-match`**

Deckt sich mit Mein-Mixariums Browser-Rechnung (0.8060). Reproduzierbar:
`node tools/verify_remote_spore.mjs sbkim/mixarium_inbox.json` + Cosinus `sbkim/spore.json`
(Sage) gegen `sbkim/mixarium_inbox.json`.

**Ehrlich:** Mixarium ⟷ Tresore liegt bei 0.7884 < 0.80 (andere Domäne — kein Match,
nichts grün-gerechnet). Die bezeugte Paarung Mixarium ⟷ Rezeptbuch 0.9544 (17.05.) bleibt.

Damit ist Mein-Mixarium der **fünfte verified-match** im Netz und der innere
Endknoten-Verbund (Sage + Rezeptbuch + Mixarium + beide Tresore + SB·KIMTool·Point) komplett.
