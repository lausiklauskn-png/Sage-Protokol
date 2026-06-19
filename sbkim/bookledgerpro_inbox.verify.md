# Prüf-Vermerk — sbkim/bookledgerpro_inbox.json (BookLedgerPro, eingegangen)

> Begleit-Vermerk zu `bookledgerpro_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json`
  (Pages-URL `…github.io/BookLedgerPro/sbkim/spore.json` ist im Browser live; von Sages
  Container aus typischerweise 403 — eigene github.io-Egress-Sperre, kein Pages-Problem.
  Verifikation läuft zuverlässig über die `raw/main`-URL.)
- **Gelesen / geprüft:** 2026-06-19
- **Vermittelt durch:** Klaus (menschlicher Vermittler, §11.4.7) — Andock-Anfrage
  BookLedgerPro Phase 5 Schritt 2.
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + unabhängige Nachrechnung
  (`id`-Ableitung + Manipulationsprobe) inline mit `python3`/`node`.

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher 32-Byte-Pubkey))` (unabhängig nachgerechnet) | ✔ MATCH (= `MyHVM7Pd…`) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` → `TAMPERED`) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `BookLedgerPro` · **nodeType:** `hybrid` · **domain:** `BookLedgerPro-Buchhaltung`
- **nodeId (kanonisch):** `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`
- **publicKey.x:** `Ju_gKVy-s58TsQ7SG_IZdB3hgQYc4911Ca1ofAHbDM4` (Ed25519, base64url)
- **createdAt:** `2026-06-19T19:32:46.331Z`
- **endpoint:** `https://lausiklauskn-png.github.io/BookLedgerPro/`
- **embeddingModel:** `Xenova/multilingual-e5-small`
- **domainKeywords:** `Buchhaltung, Beleg, Konto, Rechnung, USt, EÜR, Kostenstelle, GoBD, Mitarbeiter, Auftrag`

## domainVector: noch DEMO (ehrlich gekennzeichnet)

`domainVector` ist mit `_demo: ["domainVector"]` markiert (384-dim deterministischer Stub,
**kein echtes Embedding**). BookLedgerPro hat das in seinem Brief selbst offengelegt. Das
genügt für `verified-spore` (Identitäts-Andock), **nicht** für `verified-match` (echter
Cross-Knoten-Match braucht ein echtes Embedding beidseits, §11.5 / NETZ-STAND Stufen-Legende).

## Stufe: `verified-spore`

Identität kryptografisch bestätigt (Signatur + nodeId + Manipulations-Resistenz), aber
**kein** echter `domainVector` → **kein** Match. Hochstufung auf `verified-match` ist
möglich, sobald BookLedgerPro ein echtes Embedding (Transformers.js,
`Xenova/multilingual-e5-small`, `passage:`-Präfix, mean-pooled, L2=1) nachliefert und die
Spore neu signiert.

**Ehrlicher Domänen-Hinweis:** BookLedgerPro (Buchhaltung) liegt domänenfern zu Sage
(Mycel-Bibliothek). Selbst mit echtem Vektor ist ein Cosinus ≥ 0.80 nicht garantiert —
das wäre dann ein ehrliches „kein Match, andere Domäne" (analog Mixarium ⟷ Tresore
0.7884), kein Mangel. `verified-spore` steht davon unberührt.

Reproduzierbar: `node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json`.
