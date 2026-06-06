# Prüf-Vermerk — sbkim/jason_inbox.json (Jasons-Tresor / Knoten C, eingegangen)

> Begleit-Vermerk zu `jason_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/jason_inbox.json`.

## ⚠️ Identitätswechsel 2026-06-06 — neue Identität ersetzt die alte

Jasons-Tresor meldet: die bisher registrierte `nodeId`
`7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs` war ein Demo-Schlüssel, dessen
Passwort verloren ging (nicht wiederherstellbar). Einmalig neue Identität im
Browser erzeugt; die alte ist **hinfällig**. Diese Datei trägt jetzt die **neue,
echte** Spore. Alte nodeId wandert in `status.json` → `previousNodeIds`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/spore.json`
  (gleiche sporeUrl, nach Pages-Build; verifiziert über `raw/main`)
- **Gelesen / geprüft:** 2026-06-06
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + Manipulationsprobe inline
  + Match via `src/modules/04_match.js` `SbkimMatch.match`

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (`E13GDzI…`) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `Jasons-Tresor` · **nodeType:** `hybrid` · **domain:** `Jasons-Tresor-Bibliothek`
- **nodeId (NEU, dauerhaft):** `E13GDzIp0c7JfeZD0jVvFarNxPde8AcoP7qz7FtmdNM`
- **nodeId (ALT, hinfällig):** `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs`
- **publicKey.x:** `LStaFlc68SLZwhrUgSfY8YrdIcnjuN_2fzrnbRgF10M`
- **domainVector:** **ECHT**, 384-dim, `Xenova/multilingual-e5-small`, L2 = 1.0,
  **kein `_demo` mehr**.

## Stufe: `verified-match` — Score 0.847784

Identität kryptografisch bestätigt **und** echter Cross-Knoten-Match gerechnet:

| Paar | Score (Modul 04 `match`, Cosinus) | Schwelle | Urteil |
|---|---|---|---|
| Sage ⟷ Jasons-Tresor | **0.847784** | ≥ 0.80 | ✔ `verified-match` |

Reproduzierbar (echter Modul-04-Pfad):
`SbkimMatch.match(sage.domainVector, jason.domainVector)` →
`0.8477837195525952` (`isAboveProviderThreshold` = true).

Damit ist Jasons-Tresor von `verified-spore` (alte Demo-Identität, Vektor war
`_demo`) auf **`verified-match`** hochgestuft — der zweite echte Forker-Match nach
Sage ⟷ SB·KIMTool·Point (0.848508).
