# Prüf-Vermerk — sbkim/kuechenzettel_inbox.json (Küchenzettel, eingegangen)

> Begleit-Vermerk zu `kuechenzettel_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/kuechenzettel_inbox.json`.

- **Quelle:** von Klaus übergeben (Datei aus dem Andock-Wizard des Siegels,
  `Küchenzettel_spore_2026-10-15_gTnazwMI.json`), am Gerät erzeugt
  2026-10-15T17:38:06Z. Die Kopie hier ist byte-gleich mit der übergebenen
  Datei (`cmp`), sha256 `3ba7d1d6caa8…`. Im Depot der App nicht nachgesehen.
- **Gelesen / geprüft:** 2026-10-15
- **Verifizierer:** `tools/verify_remote_spore.mjs` (Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto), Manipulationsprobe, Score über
  `src/modules/04_match.js` `SbkimMatch.match`.

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ |
| Signatur (Ed25519) | ✔ gültig |
| Manipulationsprobe (`domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |
| privater Schlüssel | kein `d` im JWK, `key_ops` nur `["verify"]` |

- **nodeName:** `Küchenzettel` · **nodeType:** `hybrid` · **domain:** `Rezepte/Kochen/Notizen`
- **nodeId:** `gTnazwMIRk05uUJIh92nbXAszHGQUk-9r1rD_3lp89Y`
- **domainVector:** 384-dim, `Xenova/multilingual-e5-small`, L2 = 1.000000;
  `embeddingSource: "description"`, `embeddingVersion: 1`; 9 Satz-Schnipsel
  (davon 2 gekürzt „…"); Beschreibung 930 Zeichen, 18 Stichworte. Keine
  personenbezogenen Daten. Schublade `kuechenzettel`.
- Die letzten Schnipsel enthalten die Stichworte: die Spore entstand über die
  Erst-Signatur des Andock-Wizards („Beschreibung. Stichworte"). Das ist die
  zweite Text-Fassung, die S2 nachrechnet.

## Stufe: `verified-match` — Score 0.897519

| Paar | Score (Modul 04, Cosinus) | Schwelle | Urteil |
|---|---|---|---|
| Sage ⟷ Küchenzettel | **0.897519** | ≥ 0.80 | ✔ `verified-match` |

Gegen die übrigen Eingänge in `sbkim/` (Depot-Maßstab, nicht der Raum):
In-and-Out-Book 0.9022 · Rezeptbuch 0.8982 · Muttis 0.8941 · Point 0.8818 ·
Jasons-Tresor 0.8645 · Mein-Tresor 0.8602 · Mixarium 0.8402 · BookLedgerPro
0.8308 · Tomys 0.7864.

## Nicht gemessen

- Ein Beitritt zum Netz-Raum (Handshake `established`) — dafür braucht es einen
  Mitschnitt der Mycel-Karte, nicht diese Datei (LEHREN § 9).
- S2 (Vektor gegen Text) mit dem echten Modell — im Container nicht ladbar.
