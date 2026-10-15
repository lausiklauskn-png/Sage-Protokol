# Prüf-Vermerk — sbkim/inoutbook_inbox.json (Mein In-and-Out-Book, eingegangen)

> Begleit-Vermerk zu `inoutbook_inbox.json` (Inbox-Konvention INTERFACES §11.3:
> signatur-reine 1:1-Kopie + getrennter Prüf-Vermerk). Reproduzierbarer Beweis:
> `node tools/verify_remote_spore.mjs sbkim/inoutbook_inbox.json`.

- **Quelle:** von Klaus übergeben (Datei aus dem Andock-Wizard des Siegels,
  `Mein_In-and-Out-Book_spore_2026-10-15_MsQIFdqe.json`), am Tablet erzeugt
  2026-10-15T14:15:19Z. **Im Depot des In-and-Out-Book liegt keine
  `sbkim/spore.json`** — die Kopie hier ist byte-gleich mit der übergebenen
  Datei (`cmp`), sha256 `34dd10d26f76…`.
- **Gelesen / geprüft:** 2026-10-15
- **Verifizierer:** `tools/verify_remote_spore.mjs` (Modul-02-Pfad
  `SbkimSpore.verifyForeignSpore`, WebCrypto), Manipulationsprobe, Match über
  `src/modules/04_match.js` `SbkimMatch.match`.

## Ergebnis: ✔ VALID

| Prüfpunkt (§11.2) | Ergebnis |
|---|---|
| Pflichtfelder | ✔ 9/9 |
| `id == base64url(SHA256(roher Pubkey))` (unabhängig nachgerechnet) | ✔ |
| Signatur (Ed25519) | ✔ gültig |
| Manipulationsprobe (`domain` verändert) | ✔ fällt durch (`Signatur ungültig`) |
| privater Schlüssel | kein `d` im JWK, `key_ops` nur `["verify"]` |

- **nodeName:** `Mein In-and-Out-Book` · **nodeType:** `hybrid` · **domain:** `Eingangsprüfung/Ausgangsprüfung/Werkzeug`
- **nodeId:** `MsQIFdqe-HuhQsydxediaHadQmS-WEr7j-LLabpQbV0`
- **publicKey.x:** `mwdCilzA45_1iRj-XI3JrUxgNQFCq69IunuAR2Yfs-U`
- **domainVector:** echt, 384-dim, `Xenova/multilingual-e5-small`, L2 = 1.000000;
  11 Satz-Schnipsel; Beschreibung 1 245 Zeichen, 20 Stichworte (wortgleich
  `assets/siegel-inhalt.js` der App). Schublade `inoutbook`.

## Stufe: `verified-match` — Score 0.917311

| Paar | Score (Modul 04, Cosinus) | Schwelle | Urteil |
|---|---|---|---|
| Sage ⟷ In-and-Out-Book | **0.917311** | ≥ 0.80 | ✔ `verified-match` |

Gegen die übrigen Eingänge in `sbkim/` (Depot-Maßstab, nicht der Raum):
Point 0.8912 · Rezeptbuch 0.8796 · Mein-Tresor 0.8780 · Muttis 0.8770 ·
Jasons-Tresor 0.8739 · BookLedgerPro 0.8493 · Mixarium 0.8321 · Tomys 0.7803.

## Nicht gemessen

- Ein Beitritt zum Netz-Raum (Handshake `established`) — dafür braucht es einen
  Mitschnitt der Mycel-Karte, nicht diese Datei (LEHREN § 9).
- Der Raum-Maßstab (`matchScoreQuelle: raum-…`) der anderen Einträge; der Wert
  hier ist der Depot-Maßstab.

Nebenbefund: die Spore entstand am Tablet nach dem Neuladen des Modells —
damit hat Modul 03 dort ein Modell gestartet (Quelle in dieser Datei nicht
vermerkt; PFLEGE-LISTE § 15).
