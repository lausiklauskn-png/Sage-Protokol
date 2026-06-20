# Prüf-Vermerk — sbkim/bookledgerpro_inbox.json (BookLedgerPro, eingegangen)

> Begleit-Vermerk zu `bookledgerpro_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json`.

- **Quelle:** `https://raw.githubusercontent.com/lausiklauskn-png/BookLedgerPro/main/sbkim/spore.json`
  (Pages-URL `…github.io/BookLedgerPro/sbkim/spore.json` ist im Browser live; von Sages
  Container aus typischerweise 403 — eigene github.io-Egress-Sperre, kein Pages-Problem.
  Verifikation läuft zuverlässig über die `raw/main`-URL.)
- **Gelesen / geprüft:** 2026-06-20 (Hochstufung verified-spore → verified-match)
- **Vermittelt durch:** Klaus (menschlicher Vermittler, §11.4.7).
- **Verifizierer:** `tools/verify_remote_spore.mjs` (echter Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto) + Cosinus-Nachrechnung gegen Sages
  `domainVector` (Modul 04, Skalarprodukt zweier L2-normierter Vektoren).

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder (9 REQUIRED inkl. `createdAt` + `embeddingModel`) | ✔ 9/9 |
| `id == base64url(SHA256(roher 32-Byte-Pubkey))` | ✔ MATCH (= `MyHVM7Pd…`) |
| Signatur (Ed25519 über kanonische Bytes, `signature` ausgenommen) | ✔ gültig |
| Manipulationsprobe (Feld `domain` → `TAMPERED`) | ✔ fällt durch (`Signatur ungültig`) |

- **nodeName:** `BookLedgerPro` · **nodeType:** `hybrid` · **domain:** `BookLedgerPro-Buchhaltung`
- **nodeId (kanonisch):** `MyHVM7PdwEtNzOXiZNxfP_RcEXiTLjLpAls1oUm5-cQ`
- **publicKey.x:** `Ju_gKVy-s58TsQ7SG_IZdB3hgQYc4911Ca1ofAHbDM4` (Ed25519, base64url) — Schlüssel unverändert
- **createdAt:** `2026-06-20T20:34:33.416Z` (neu signiert mit echtem Vektor)
- **embeddingModel:** `Xenova/multilingual-e5-small`
- **domainKeywords:** `Buchhaltung, Beleg, Konto, Rechnung, USt, EÜR, Kostenstelle, GoBD, Mitarbeiter, Auftrag`

## domainVector: jetzt ECHT (kein `_demo` mehr)

`domainVector` ist ein echtes `Xenova/multilingual-e5-small`-Embedding (384-dim, `passage:`-Präfix,
mean-pooled, **L2 = 1.000000**) — kein `_demo`-Stub mehr. BookLedgerPros Betreiber hat das Modell
einmalig in der App geladen und die Spore neu signiert.

## Cross-Knoten-Match (Modul 04)

| Größe | Wert |
|---|---|
| Sage `domainVector` | 384-dim, L2 = 1.000000 |
| BookLedgerPro `domainVector` | 384-dim, L2 = 1.000000 |
| **Cosinus Sage ⟷ BookLedgerPro** | **0.810579** |
| Schwelle `PROVIDER_MIN_MATCH` | 0.80 |

**0.810579 ≥ 0.80 → ✔ `verified-match`.**

## Stufe: `verified-match`

Identität kryptografisch bestätigt **und** echter semantischer Cross-Knoten-Match ≥ 0.80.
Bemerkenswert ehrlich: Buchhaltung liegt domänenfern zur Mycel-Bibliothek, der Wert liegt
knapp, aber sauber über der Schwelle (kein Grün-Rechnen — nachrechenbar unten).

Reproduzierbar:
`node tools/verify_remote_spore.mjs sbkim/bookledgerpro_inbox.json` (Signatur)
+ Cosinus aus `sbkim/spore.json` ⟷ `sbkim/bookledgerpro_inbox.json` (`domainVector`-Skalarprodukt).
