# Prüf-Vermerk — sbkim/jason_inbox.json (Jasons-Tresor / Knoten C, eingegangen)

> Begleit-Vermerk zu `jason_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/jason_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/Jasons-Tresor/main/sbkim/spore.json`
  (Pages-URL `…github.io/Jasons-Tresor/sbkim/spore.json` ist im Browser live; von Sages
  Container aus 403 — eigene github.io-Egress-Sperre, kein Pages-Problem)
- **Gelesen / geprüft:** 2026-05-31
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto)

## Ergebnis: ✔ VALID

| Prüfpunkt | Ergebnis |
|---|---|
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH |
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| Manipulationsprobe (Feld `domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `Jasons-Tresor` · **nodeType:** `hybrid` · **domain:** `Jasons-Tresor-Bibliothek`
- **nodeId (dauerhaft, stabil):** `7F_zNopFgYLPCmEFhVlRUDnQVKk3y-RHNr139Z_3hCs`
- **publicKey.x:** `NIclmThJRm4dg2AI0f9B61KFs6aXgQWC2yzrr5gRV9c`
- **domainVector:** 384 Floats, ehrlich als `_demo`-Stub markiert (noch kein echtes Embedding)

## Stufe: `verified-spore` (KEIN Match)

Identität beidseitig kryptografisch bestätigt. **Kein** `verified-match`, weil der
`domainVector` noch Demo ist (INTERFACES §11.5: `domainVector` Pflicht erst für
`verified-match`). Hochstufung auf `verified-match` folgt, sobald Jasons-Tresor einen
echten 384-dim-Vektor (`Xenova/multilingual-e5-small`, `passage: `-Präfix) re-signt —
oder Sage ihn aus dem Domänen-Text rechnet (Browser-Helfer `tools/embed_helper.html`).

Damit ist Jasons-Tresor der **dritte** über das SBKIM-Protokoll verifizierte Forker-Knoten
(neben SB·KIMTool·Point) — der erste Andock-Schritt eines Drei-Knoten-Netzes.

---

## Nachtrag 2026-05-31 (Sync-Brief Knoten C): Spore LIVE, Identität unverändert

Jasons-Tresor meldet die Spore jetzt als live (Pages, im Browser sichtgeprüft). Sage hat
die Live-`raw/main`-Spore neu geholt und **byte-identisch** zu dieser registrierten Kopie
befunden (`diff` = identisch) — nodeId/Signatur/Spore aus der Erst-Registrierung gelten
unverändert weiter, kein Re-Verify nötig. Quittung im Postfach
`sbkim/AUSTAUSCH-JasonsTresor.md`.
